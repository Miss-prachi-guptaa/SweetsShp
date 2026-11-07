'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ProductItem {
  id: number;
  name: string;
  weight: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  tag?: string;
  cutType?: string;
  description?: string;
  inStock?: boolean;
}

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  count?: number;
}

interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  requirement?: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'RESOLVED';
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'contacts' | 'reports' | 'pincodes'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<ContactInquiry[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings & Pincodes State
  const [storeSettings, setStoreSettings] = useState<{ isStoreOpen: boolean; closedNotice?: string; pincodes: Record<string, any> }>({
    isStoreOpen: true,
    closedNotice: '',
    pincodes: {}
  });
  const [newPincode, setNewPincode] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newTime, setNewTime] = useState('45-60 mins');
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // Orders Slot & Status Filters
  const [orderSlotFilter, setOrderSlotFilter] = useState<'ALL' | 'EXPRESS' | 'MORNING' | 'EVENING'>('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'PACKING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderCategoryFilter, setOrderCategoryFilter] = useState<string>('ALL');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [contactFilter, setContactFilter] = useState<'ALL' | 'UNREAD' | 'REPLIED' | 'RESOLVED'>('ALL');
  const [contactSearch, setContactSearch] = useState('');

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'product' | 'contact' | 'category';
    id: string | number;
    title: string;
  } | null>(null);

  // Image Uploading State (Direct gallery upload & compression)
  const [uploadingImage, setUploadingImage] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    weight: '500 g',
    price: '',
    originalPrice: '',
    category: 'Chicken',
    image: '',
    cutType: 'Curry Cut',
    tag: '',
    description: '',
    inStock: true,
  });

  // New Category form
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
  });

  const notify = (type: 'success' | 'error', message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 4500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resContacts, resProducts, resCategories, resOrders, resSettings] = await Promise.all([
        fetch('/api/contacts').then((r) => r.json()).catch(() => ({ data: [] })),
        fetch('/api/products').then((r) => r.json()).catch(() => ({ data: [] })),
        fetch('/api/categories').then((r) => r.json()).catch(() => ({ data: [] })),
        fetch('/api/orders').then((r) => r.json()).catch(() => ({ orders: [] })),
        fetch('/api/settings').then((r) => r.json()).catch(() => ({ settings: null })),
      ]);

      if (resSettings && resSettings.settings) setStoreSettings(resSettings.settings);

      if (resContacts.data) setContacts(resContacts.data);
      if (resProducts.data) setProducts(resProducts.data);
      if (resCategories.data) setCategories(resCategories.data);
      if (resOrders.orders) setOrders(resOrders.orders);
    } catch {
      notify('error', 'Error loading administrative data.');
    } finally {
      setLoading(false);
    }
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('chiksum_admin_session') === 'true';
      setIsAuthenticated(isAuth);
      if (isAuth) {
        loadAllData();
      } else {
        setLoading(false);
      }
    }
  }, []);


  // Handlers for Order Status Update & Printing
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
        );
        notify('success', `Order #${orderId} marked as ${status}!`);
      } else {
        notify('error', data.error || 'Failed to update order status');
      }
    } catch {
      notify('error', 'Network error updating order status');
    }
  };

  const handlePrintReceipt = (ord: any, type: 'INVOICE' | 'CHALLAN') => {
    const isChallan = type === 'CHALLAN';
    const itemsHtml = (ord.items || [])
      .map(
        (it: any, i: number) => `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px 4px; text-align: left;">${i + 1}</td>
          <td style="padding: 8px 4px; text-align: left;">
            <strong>${it.name}</strong><br/>
            <span style="font-size: 11px; color: #555;">Weight: ${it.weight}</span>
          </td>
          <td style="padding: 8px 4px; text-align: center;">${it.quantity}</td>
          ${!isChallan ? `<td style="padding: 8px 4px; text-align: right;">₹${it.price}</td>` : ''}
          ${!isChallan ? `<td style="padding: 8px 4px; text-align: right; font-weight: bold;">₹${it.price * it.quantity}</td>` : ''}
        </tr>
      `
      )
      .join('');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${isChallan ? 'Delivery Challan' : 'Customer Tax Invoice'} - #${ord.orderId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111; max-width: 650px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
            .badge { display: inline-block; padding: 4px 10px; background: #000; color: #fff; font-size: 12px; font-weight: bold; border-radius: 4px; margin-top: 4px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; font-size: 13px; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
            th { border-bottom: 2px solid #333; padding: 8px 4px; text-align: left; background: #f5f5f5; }
            .totals { margin-top: 16px; text-align: right; font-size: 14px; line-height: 1.6; }
            .footer { margin-top: 32px; border-top: 1px dashed #aaa; padding-top: 12px; font-size: 11px; text-align: center; color: #666; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">CHICKSUM FRESH MEATS</h1>
            <p style="margin: 2px 0 0; font-size: 12px;">Premium Farm-Fresh Chicken, Pasture Goat & Sweetwater Fish</p>
            <p style="margin: 2px 0 0; font-size: 12px;">Varanasi, UP • Helpline: +91 9988804146</p>
            <div class="badge">${isChallan ? 'DELIVERY BOY SLIP / CHALLAN' : 'OFFICIAL CUSTOMER INVOICE'}</div>
          </div>

          <div class="info-grid">
            <div>
              <strong>Order Details:</strong><br/>
              Order ID: <strong>#${ord.orderId}</strong><br/>
              Date: ${ord.createdAt ? new Date(ord.createdAt).toLocaleString() : new Date().toLocaleString()}<br/>
              Delivery Slot: <strong>${ord.deliverySlot || 'Express (45-60 mins)'}</strong><br/>
              Payment Method: <strong>${ord.paymentMethod === 'UPI_ON_DELIVERY' ? 'UPI on Delivery (Scan QR)' : ord.paymentMethod || 'COD'}</strong>
            </div>
            <div>
              <strong>Customer & Destination:</strong><br/>
              Name: <strong>${ord.customerName}</strong><br/>
              Phone: <strong>+91 ${ord.mobileNumber}</strong><br/>
              Address: ${ord.streetAddress || ''} ${ord.landmark ? `(Landmark: ${ord.landmark})` : ''}<br/>
              PIN Code: <strong>${ord.pincode}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 30px;">#</th>
                <th>Item & Cut Specification</th>
                <th style="width: 50px; text-align: center;">Qty</th>
                ${!isChallan ? '<th style="width: 80px; text-align: right;">Rate</th>' : ''}
                ${!isChallan ? '<th style="width: 90px; text-align: right;">Amount</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            ${!isChallan ? `
              <div>Items Subtotal: ₹${ord.itemsPrice || ord.finalTotal}</div>
              ${ord.discount ? `<div style="color: green;">Discount Coupon: -₹${ord.discount}</div>` : ''}
              ${ord.deliveryFee ? `<div>Delivery Fee: ₹${ord.deliveryFee}</div>` : '<div>Delivery Fee: Free</div>'}
            ` : ''}
            <div style="font-size: 18px; font-weight: bold; margin-top: 6px;">
              ${isChallan ? 'CASH/UPI TO COLLECT ON DELIVERY:' : 'TOTAL PAYABLE:'} 
              <span style="border-bottom: 2px solid #000; padding-bottom: 2px;">₹${ord.finalTotal}</span>
            </div>
          </div>

          ${isChallan ? `
            <div style="margin-top: 24px; padding: 12px; border: 1px solid #333; border-radius: 6px; font-size: 12px;">
              <strong>Rider Instructions:</strong><br/>
              1. Inspect thermal pack seals before handing over.<br/>
              2. Collect exact cash or ask customer to scan phone/box UPI QR code.<br/>
              3. Customer Signature: ___________________________
            </div>
          ` : ''}

          <div class="footer">
            Thank you for choosing Chicksum! Freshly cut with love and hygienic care.<br/>
            For support or reorders, WhatsApp us at +91 9988804146.
          </div>

          <div class="no-print" style="text-align: center; margin-top: 24px;">
            <button onclick="window.print()" style="padding: 10px 24px; font-size: 14px; font-weight: bold; background: #000; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
              🖨️ Print Slip Now
            </button>
          </div>
        </body>
      </html>
    `;

    const printWin = window.open('', '_blank', 'width=800,height=900');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printContent);
      printWin.document.close();
      setTimeout(() => {
        printWin.focus();
        printWin.print();
      }, 400);
    }
  };

  // Handlers for Store Settings & Pincodes
  const handleToggleStoreOpen = async () => {
    const nextState = !storeSettings.isStoreOpen;
    setUpdatingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isStoreOpen: nextState }),
      });
      const data = await res.json();
      if (data.success) {
        setStoreSettings(data.settings);
        notify('success', nextState ? 'Store is now OPEN and accepting orders!' : 'Store is now CLOSED. Customers will see notice.');
      } else {
        notify('error', 'Failed to update store status');
      }
    } catch {
      notify('error', 'Network error');
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleTogglePincode = async (pin: string) => {
    const current = storeSettings.pincodes[pin];
    if (!current) return;
    const updated = {
      ...storeSettings.pincodes,
      [pin]: { ...current, active: current.active === false ? true : false }
    };
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincodes: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setStoreSettings(data.settings);
        notify('success', `PIN Code ${pin} is now ${updated[pin].active ? 'ENABLED' : 'DISABLED'}`);
      }
    } catch {
      notify('error', 'Failed to update pincode');
    }
  };

  const handleAddPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPincode || newPincode.trim().length !== 6) {
      notify('error', 'Enter valid 6-digit PIN code');
      return;
    }
    if (!newArea.trim()) {
      notify('error', 'Enter area name');
      return;
    }
    const pin = newPincode.trim();
    const updated = {
      ...storeSettings.pincodes,
      [pin]: {
        area: newArea.trim(),
        fee: 0,
        time: newTime.trim() || '45-60 mins',
        active: true
      }
    };
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincodes: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setStoreSettings(data.settings);
        setNewPincode('');
        setNewArea('');
        notify('success', `PIN Code ${pin} (${newArea}) added successfully!`);
      }
    } catch {
      notify('error', 'Failed to add pincode');
    }
  };

    const handleAdminPageLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const user = loginUser.trim().toLowerCase();
    const pass = loginPass.trim();

    if (
      user === 'admin' &&
      pass === 'chicksumutkarsh@01'
    ) {
      localStorage.setItem('chiksum_admin_session', 'true');
      setIsAuthenticated(true);
      loadAllData();
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chiksum_admin_session');
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  };

  // Upload and compress image directly from phone/desktop gallery
  const handleDirectImageUpload = async (
    file: File,
    categoryTag: string,
    onSuccess: (url: string) => void
  ) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('error', 'Please choose a valid image from your gallery.');
      return;
    }

    setUploadingImage(true);
    setCompressionInfo(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', categoryTag);

    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        onSuccess(data.data.url);
        const originalKb = (file.size / 1024).toFixed(1);
        const compressedKb = ((data.data.compressedSize || data.data.size) / 1024).toFixed(1);
        const reduction = data.data.reductionPercent || 0;
        setCompressionInfo(`✓ Compressed: ${originalKb} KB → ${compressedKb} KB (-${reduction}%)`);
        notify('success', `Photo compressed & uploaded (-${reduction}% size)!`);
      } else {
        notify('error', data.error || 'Failed to compress and upload image.');
      }
    } catch {
      notify('error', 'Network error while compressing image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Category CRUD
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      notify('error', 'Category name is required.');
      return;
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => [...prev, data.data]);
        notify('success', `Category "${newCategory.name}" created!`);
        // If user was adding a product, auto select the new category
        setNewProduct((prev) => ({ ...prev, category: data.data.name }));
        setNewCategory({ name: '', description: '', image: '' });
      } else {
        notify('error', data.error || 'Failed to add category.');
      }
    } catch {
      notify('error', 'Error creating category.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        notify('success', 'Category deleted successfully.');
        setDeleteConfirmation(null);
      } else {
        notify('error', data.error || 'Failed to delete category.');
      }
    } catch {
      notify('error', 'Error deleting category.');
    }
  };

  // Product CRUD
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      notify('error', 'Product name and price are required.');
      return;
    }

    if (!newProduct.image) {
      notify('error', 'Please choose a photo from your gallery first.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => [...prev, data.data]);
        notify('success', `Product "${newProduct.name}" added successfully.`);
        setIsAddProductOpen(false);
        setNewProduct({
          name: '',
          weight: '500 g',
          price: '',
          originalPrice: '',
          category: categories[0]?.name || 'Chicken',
          image: '',
          cutType: 'Curry Cut',
          tag: '',
          description: '',
          inStock: true,
        });
        setCompressionInfo(null);
      } else {
        notify('error', data.error || 'Failed to add product.');
      }
    } catch {
      notify('error', 'Error creating product.');
    }
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
        notify('success', `Product "${editingProduct.name}" updated successfully.`);
        setEditingProduct(null);
        setCompressionInfo(null);
      } else {
        notify('error', data.error || 'Failed to save product updates.');
      }
    } catch {
      notify('error', 'Error saving product updates.');
    }
  };

  const handleToggleStock = async (product: ProductItem) => {
    const updatedStock = !product.inStock;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: updatedStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, inStock: updatedStock } : p)));
        notify('success', `${product.name} is now ${updatedStock ? 'In Stock' : 'Out of Stock'}.`);
      }
    } catch {
      notify('error', 'Failed to update stock status.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        notify('success', 'Product deleted from catalog.');
        setDeleteConfirmation(null);
      } else {
        notify('error', data.error || 'Failed to delete product.');
      }
    } catch {
      notify('error', 'Error deleting product.');
    }
  };

  // Contact Inquiry Actions
  const handleUpdateContactStatus = async (id: string, status: ContactInquiry['status']) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
        notify('success', `Inquiry status changed to ${status}`);
      }
    } catch {
      notify('error', 'Failed to update contact status.');
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        notify('success', 'Inquiry deleted successfully.');
        setDeleteConfirmation(null);
      } else {
        notify('error', data.error || 'Failed to delete inquiry.');
      }
    } catch {
      notify('error', 'Failed to delete inquiry.');
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchCat = productCategoryFilter === 'ALL' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
    const matchSearch =
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tag?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.cutType?.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const unreadCount = contacts.filter((c) => c.status === 'UNREAD').length;

  const filteredContacts = contacts.filter((c) => {
    const matchStatus = contactFilter === 'ALL' || c.status === contactFilter;
    const matchSearch =
      !contactSearch ||
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone.includes(contactSearch) ||
      c.message.toLowerCase().includes(contactSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="admin-page-root" style={{ minHeight: '100vh', background: '#0a0a0e', color: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Responsive Styles Injection */}
      <style>{`
        .admin-header-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .admin-tabs-bar {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 20px;
          gap: 4px;
        }
        .admin-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 14px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: #9ca3af;
          transition: all 0.2s;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .admin-tab-btn.active {
          color: #e2b43b;
          border-bottom: 2px solid #e2b43b;
          background: rgba(226, 180, 59, 0.12);
        }
        .admin-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .admin-filters-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        /* Mobile vs Desktop View Toggle */
        .admin-desktop-table {
          display: block;
        }
        .admin-mobile-cards {
          display: none;
        }

        .modal-grid-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Mobile Breakpoints (<768px) */
        @media (max-width: 768px) {
          .admin-header-actions {
            width: 100%;
            justify-content: space-between;
          }
          .admin-header-actions button,
          .admin-header-actions a {
            flex: 1;
            justify-content: center;
            text-align: center;
          }
          .admin-desktop-table {
            display: none !important;
          }
          .admin-mobile-cards {
            display: flex !important;
            flex-direction: column;
            gap: 12px;
          }
          .admin-controls-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .admin-filters-group {
            flex-direction: column;
            width: 100%;
          }
          .admin-filters-group input,
          .admin-filters-group select,
          .admin-filters-group button {
            width: 100% !important;
            box-sizing: border-box;
          }
          .modal-grid-row {
            grid-template-columns: 1fr !important;
          }
          .admin-tab-btn {
            padding: 10px 8px !important;
            font-size: 12.5px !important;
          }
        }
      `}</style>

      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid rgba(226, 180, 59, 0.2)',
          background: '#121218',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '12px 16px',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto' }} className="admin-header-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #e2b43b, #b38217)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              🥩
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#ffffff' }}>CHICKSUM CONSOLE</h1>
                <span style={{ fontSize: '10px', background: 'rgba(226, 180, 59, 0.15)', color: '#e2b43b', border: '1px solid rgba(226, 180, 59, 0.3)', padding: '1px 6px', borderRadius: '8px', fontWeight: 600 }}>
                  ADMIN
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '1px 0 0 0' }}>Khojwan, Varanasi Butcher Desk</p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button
              onClick={loadAllData}
              disabled={loading}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#e5e7eb',
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ display: 'inline-block', transform: loading ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s' }}>🔄</span>
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #e2b43b, #c5972c)',
                color: '#0d0d12',
                fontWeight: 700,
                fontSize: '12.5px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>View Storefront</span>
              <span>↗</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="Logout from Admin Console"
            >
              <span>Logout</span>
              <span>🚪</span>
            </button>
          </div>
        </div>
      </header>

      {/* Action Notice */}
      {actionNotice && (
        <div
          style={{
            maxWidth: '1360px',
            margin: '12px 16px 0',
            padding: '10px 16px',
            borderRadius: '8px',
            background: actionNotice.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${actionNotice.type === 'success' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            color: actionNotice.type === 'success' ? '#4ade80' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
          }}
        >
          <span>{actionNotice.message}</span>
          <button onClick={() => setActionNotice(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '15px' }}>✕</button>
        </div>
      )}

      {/* If Not Authenticated, Show Protected Login Screen */}
      {isAuthenticated === false ? (
        <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
          <div
            style={{
              maxWidth: '380px',
              width: '100%',
              background: '#15151c',
              border: '1px solid rgba(226, 180, 59, 0.4)',
              borderRadius: '16px',
              padding: '28px 24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #e2b43b, #b38217)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginBottom: '10px',
                }}
              >
                🥩
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: '#ffffff' }}>Admin Console Login</h2>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Khojwan, Varanasi Butcher Desk</p>
            </div>

            {loginError && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  fontSize: '12px',
                  marginBottom: '14px',
                }}
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminPageLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Username</label>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#1c1c24',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#1c1c24',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '6px',
                  padding: '11px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #e2b43b, #c5972c)',
                  color: '#0d0d12',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Login to Console →
              </button>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <Link href="/" style={{ color: '#9ca3af', fontSize: '12px', textDecoration: 'underline' }}>
                  ← Return to Storefront
                </Link>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* ONLY 2 CLEAN TABS */
        <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '16px 16px 60px' }}>
        {/* Store Open / Close Switch Banner */}
        <div style={{
          background: storeSettings.isStoreOpen ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${storeSettings.isStoreOpen ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{storeSettings.isStoreOpen ? '🟢' : '🔴'}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>
                Store Status: <span style={{ color: storeSettings.isStoreOpen ? '#4ade80' : '#f87171' }}>{storeSettings.isStoreOpen ? 'OPEN (Accepting Orders)' : 'STORE CLOSED'}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                {storeSettings.isStoreOpen ? 'Customers can place orders normally across all active Varanasi delivery areas.' : 'Store is paused. Customers will see a store closed banner.'}
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleStoreOpen}
            disabled={updatingSettings}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: storeSettings.isStoreOpen ? '#dc2626' : '#16a34a',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {storeSettings.isStoreOpen ? '🔴 Close Store (Pause Orders)' : '🟢 Open Store (Accept Orders)'}
          </button>
        </div>

        <div className="admin-tabs-bar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setActiveTab('orders')}
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          >
            <span>📦 Orders</span>
            <span style={{ fontSize: '11px', background: activeTab === 'orders' ? '#e2b43b' : 'rgba(255,255,255,0.08)', color: activeTab === 'orders' ? '#000' : '#fff', padding: '1px 7px', borderRadius: '10px', fontWeight: 800 }}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`admin-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          >
            <span>📊 Reports &amp; Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('pincodes')}
            className={`admin-tab-btn ${activeTab === 'pincodes' ? 'active' : ''}`}
          >
            <span>📍 Pincodes &amp; Areas</span>
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: '10px' }}>
              {Object.keys(storeSettings.pincodes || {}).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          >
            <span>🍗 Products</span>
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: '10px' }}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`admin-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          >
            <span>💬 Inquiries</span>
            {unreadCount > 0 ? (
              <span style={{ fontSize: '10.5px', background: '#ef4444', color: '#fff', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>
                {unreadCount} NEW
              </span>
            ) : (
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: '10px' }}>
                {contacts.length}
              </span>
            )}
          </button>
        </div>

        {/* SECTION 0: ORDERS MANAGEMENT & NOTIFICATIONS */}
        {activeTab === 'orders' && (() => {
          // Extract unique categories across all orders for filter dropdown
          const availableCategories = new Set<string>();
          orders.forEach((ord: any) => {
            (ord.items || []).forEach((it: any) => {
              if (it.category) availableCategories.add(it.category);
            });
          });

          // Filter orders by search, slot, and category item contents
          const filteredOrders = orders.filter((ord: any) => {
            // Search filter
            if (orderSearch) {
              const q = orderSearch.toLowerCase();
              const matchId = (ord.orderId || '').toLowerCase().includes(q);
              const matchName = (ord.customerName || '').toLowerCase().includes(q);
              const matchPhone = (ord.mobileNumber || '').includes(q);
              const matchPin = (ord.pincode || '').includes(q);
              const matchItem = (ord.items || []).some((it: any) => (it.name || '').toLowerCase().includes(q));
              if (!matchId && !matchName && !matchPhone && !matchPin && !matchItem) return false;
            }

            // Slot filter
            if (orderSlotFilter !== 'ALL') {
              const slot = (ord.deliverySlot || '').toUpperCase();
              if (orderSlotFilter === 'EXPRESS' && !slot.includes('EXPRESS')) return false;
              if (orderSlotFilter === 'MORNING' && !slot.includes('MORNING')) return false;
              if (orderSlotFilter === 'EVENING' && !slot.includes('EVENING')) return false;
            }

            // Category item filter (e.g. show orders containing Chicken, Mutton, Fish, Vegetables)
            if (orderCategoryFilter !== 'ALL') {
              const hasCat = (ord.items || []).some((it: any) =>
                (it.category || '').toLowerCase() === orderCategoryFilter.toLowerCase()
              );
              if (!hasCat) return false;
            }

            return true;
          });

          return (
            <div>
              <div className="admin-controls-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#ffffff' }}>Customer Orders &amp; Dispatches</h2>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                    Compact view with 1-click expand, item &amp; slot tracking, and printing slips.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={loadAllData}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#1c1c24',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🔄 Refresh Orders
                  </button>
                </div>
              </div>

              {/* Multi-Filter Bar: Search, Category Filter & Delivery Slot */}
              <div style={{
                background: '#15151c',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '16px',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                {/* Search */}
                <input
                  type="text"
                  placeholder="🔍 Search Order ID, Customer, Phone, Item, PIN..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#0a0d13',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '12.5px',
                    minWidth: '240px',
                    flex: '1'
                  }}
                />

                {/* Filter by Category / Meat Type */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Item Type:</span>
                  <select
                    value={orderCategoryFilter}
                    onChange={(e: any) => setOrderCategoryFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#0a0d13',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#e2b43b',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">All Items / Cuts</option>
                    <option value="Chicken">🍗 Chicken Orders</option>
                    <option value="Mutton">🥩 Mutton Orders</option>
                    <option value="Fish & Seafood">🐟 Fish &amp; Seafood</option>
                    <option value="Vegetables">🥔 Vegetables</option>
                  </select>
                </div>

                {/* Delivery Slot Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Slot:</span>
                  <select
                    value={orderSlotFilter}
                    onChange={(e: any) => setOrderSlotFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#0a0d13',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#e2b43b',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">All Slots ({orders.length})</option>
                    <option value="EXPRESS">⚡ Express (45-60 mins)</option>
                    <option value="MORNING">🌅 Morning (7 AM - 10 AM)</option>
                    <option value="EVENING">🌆 Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', background: '#121218', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '32px' }}>📦</span>
                  <h3 style={{ fontSize: '16px', color: '#fff', marginTop: '10px' }}>No orders found matching filter</h3>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>Try clearing your search query or changing category/slot filter.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredOrders.map((ord: any) => {
                    const isExpanded = Boolean(expandedOrders[ord.orderId]);
                    const itemsSummary = (ord.items || [])
                      .map((it: any) => `${it.name} (${it.weight}) x${it.quantity}`)
                      .join(', ');

                    return (
                      <div
                        key={ord.orderId}
                        style={{
                          background: '#13151d',
                          border: `1px solid ${isExpanded ? 'rgba(226, 180, 59, 0.4)' : 'rgba(255,255,255,0.09)'}`,
                          borderRadius: '10px',
                          overflow: 'hidden',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* COMPACT ONE-LINE ROW (Important Details at a glance) */}
                        <div
                          onClick={() => toggleOrderExpand(ord.orderId)}
                          style={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            flexWrap: 'wrap',
                            gap: '10px',
                            background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent'
                          }}
                        >
                          {/* Left: ID + Slot Badge + Customer + Phone */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: '1', minWidth: '280px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#e2b43b', fontSize: '14.5px' }}>
                              #{ord.orderId}
                            </span>

                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: (ord.deliverySlot || '').includes('Express') ? 'rgba(226, 180, 59, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                              color: (ord.deliverySlot || '').includes('Express') ? '#e2b43b' : '#38bdf8',
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                              {(ord.deliverySlot || '').includes('Express') ? '⚡ Express' : (ord.deliverySlot || '').includes('Morning') ? '🌅 Morning' : '🌆 Evening'}
                            </span>

                            <span style={{ fontWeight: 700, color: '#fff', fontSize: '13.5px' }}>
                              👤 {ord.customerName}
                            </span>

                            <span style={{ color: '#9ca3af', fontSize: '12.5px' }}>
                              📞 +91 {ord.mobileNumber}
                            </span>

                            <span style={{ color: '#6b7280', fontSize: '12px' }}>
                              PIN: <strong style={{ color: '#d1d5db' }}>{ord.pincode}</strong>
                            </span>

                            {/* Brief Items Peek in 1 line */}
                            <span style={{
                              color: '#9ca3af',
                              fontSize: '11.5px',
                              maxWidth: '320px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              background: 'rgba(255,255,255,0.04)',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }} title={itemsSummary}>
                              🛒 {itemsSummary}
                            </span>
                          </div>

                          {/* Right: Total + Payment + Expand Button */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '16px', fontWeight: 900, color: '#e2b43b', fontFamily: 'monospace' }}>
                                ₹{ord.finalTotal}
                              </div>
                              <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                                {ord.paymentMethod === 'UPI_ON_DELIVERY' ? '📱 UPI' : '💵 COD'}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOrderExpand(ord.orderId);
                              }}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                background: isExpanded ? '#e2b43b' : '#1e2535',
                                color: isExpanded ? '#000' : '#e2b43b',
                                border: '1px solid rgba(226, 180, 59, 0.4)',
                                fontSize: '11px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>{isExpanded ? 'Less Details' : 'More Details'}</span>
                              <span>{isExpanded ? '▲' : '▼'}</span>
                            </button>
                          </div>
                        </div>

                        {/* EXPANDABLE ACCORDION BODY (Revealed when clicked) */}
                        {isExpanded && (
                          <div style={{
                            padding: '14px 16px',
                            borderTop: '1px solid rgba(255,255,255,0.07)',
                            background: '#0a0d13'
                          }}>
                            {/* Address & Slot Details */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                              <div style={{ fontSize: '12.5px', color: '#d1d5db', lineHeight: '1.5' }}>
                                <span style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Delivery Address:</span>
                                📍 {ord.streetAddress}{ord.landmark ? ` (Landmark: ${ord.landmark})` : ''}, PIN: <strong>{ord.pincode}</strong>
                              </div>

                              <div style={{ fontSize: '12.5px', color: '#d1d5db', lineHeight: '1.5' }}>
                                <span style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Order Timestamp &amp; Timing:</span>
                                📅 {ord.createdAt ? new Date(ord.createdAt).toLocaleString() : 'Recent'}<br/>
                                ⏰ Full Slot: <strong style={{ color: '#e2b43b' }}>{ord.deliverySlot}</strong>
                              </div>
                            </div>

                            {/* Full Ordered Items Breakdown Grid */}
                            <div style={{ marginBottom: '14px' }}>
                              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', fontWeight: 700 }}>
                                Items to Prepare &amp; Pack ({ord.items?.length || 0}):
                              </span>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px', marginTop: '6px' }}>
                                {ord.items?.map((it: any, i: number) => (
                                  <div key={i} style={{ background: '#13151d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#e5e7eb', fontWeight: 600 }}>{it.name} ({it.weight})</span>
                                    <span style={{ color: '#e2b43b', fontWeight: 800 }}>x {it.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Quick Action Buttons: Invoice, Delivery Challan, WhatsApp */}
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              <button
                                onClick={() => handlePrintReceipt(ord, 'INVOICE')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#1e2535',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  color: '#fff',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                📄 Customer Invoice
                              </button>

                              <button
                                onClick={() => handlePrintReceipt(ord, 'CHALLAN')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#1e2535',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  color: '#e2b43b',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                🛵 Delivery Boy Slip
                              </button>

                              <a
                                href={`https://wa.me/91${ord.mobileNumber}?text=${encodeURIComponent(`Hi ${ord.customerName}! Your CHICKSUM Order #${ord.orderId} is being prepared. Delivery Slot: ${ord.deliverySlot}. Total: ₹${ord.finalTotal}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#25D366',
                                  color: '#000',
                                  padding: '6px 14px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                }}
                              >
                                💬 WhatsApp Customer
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* SECTION 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div>
            <div className="admin-controls-bar">
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#ffffff' }}>Products Catalog</h2>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>Manage cuts, prices, categories &amp; photos from gallery.</p>
              </div>

              <div className="admin-filters-group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#15151c',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#f3f4f6',
                    fontSize: '13px',
                    minWidth: '160px',
                  }}
                />

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#15151c',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#f3f4f6',
                    fontSize: '13px',
                  }}
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setIsManageCategoriesOpen(true)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#e5e7eb',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  <span>🏷️ Categories ({categories.length})</span>
                </button>

                <button
                  onClick={() => {
                    setCompressionInfo(null);
                    setIsAddProductOpen(true);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #e2b43b, #c5972c)',
                    color: '#0d0d12',
                    fontWeight: 700,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>➕ Add Product</span>
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="admin-desktop-table" style={{ background: '#15151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Product</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Category</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Weight / Cut</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Price</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Stock</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', background: '#222' }}
                              onError={(e) => {
                                (e.target as any).src = '/categories/chicken.png';
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, color: '#f3f4f6' }}>{p.name}</div>
                              {p.tag && (
                                <span style={{ fontSize: '10px', background: 'rgba(226, 180, 59, 0.15)', color: '#e2b43b', padding: '1px 6px', borderRadius: '4px' }}>
                                  {p.tag}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{p.category}</td>
                        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>
                          <div>{p.weight}</div>
                          {p.cutType && <div style={{ fontSize: '11px', color: '#6b7280' }}>{p.cutType}</div>}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#f3f4f6' }}>
                          ₹{p.price}
                          {p.originalPrice && (
                            <span style={{ fontSize: '11px', color: '#6b7280', textDecoration: 'line-through', marginLeft: '6px' }}>
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => handleToggleStock(p)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: p.inStock !== false ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: p.inStock !== false ? '#4ade80' : '#f87171',
                            }}
                          >
                            {p.inStock !== false ? '● In Stock' : '○ Out of Stock'}
                          </button>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => {
                              setCompressionInfo(null);
                              setEditingProduct({ ...p });
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.06)',
                              color: '#f3f4f6',
                              border: '1px solid rgba(255,255,255,0.1)',
                              fontSize: '12px',
                              cursor: 'pointer',
                              marginRight: '6px',
                            }}
                          >
                            Edit ✏️
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation({ type: 'product', id: p.id, title: p.name })}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              border: 'none',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            Delete 🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View (Optimized for Phones) */}
            <div className="admin-mobile-cards">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: '#15151c',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover', background: '#222', flexShrink: 0 }}
                      onError={(e) => {
                        (e.target as any).src = '/categories/chicken.png';
                      }}
                    />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#f3f4f6', fontSize: '14px', lineHeight: '1.3' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                        {p.category} • {p.weight} {p.cutType ? `• ${p.cutType}` : ''}
                      </div>
                      {p.tag && (
                        <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '10px', background: 'rgba(226, 180, 59, 0.15)', color: '#e2b43b', padding: '1px 6px', borderRadius: '4px' }}>
                          {p.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>₹{p.price}</span>
                      {p.originalPrice && (
                        <span style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'line-through', marginLeft: '6px' }}>
                          ₹{p.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleStock(p)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: p.inStock !== false ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: p.inStock !== false ? '#4ade80' : '#f87171',
                      }}
                    >
                      {p.inStock !== false ? '● In Stock' : '○ Out of Stock'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                    <button
                      onClick={() => {
                        setCompressionInfo(null);
                        setEditingProduct({ ...p });
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#f3f4f6',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      Edit ✏️
                    </button>

                    <button
                      onClick={() => setDeleteConfirmation({ type: 'product', id: p.id, title: p.name })}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        border: 'none',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      Delete 🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: CONTACT INQUIRIES */}
        {activeTab === 'contacts' && (
          <div>
            <div className="admin-controls-bar">
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#ffffff' }}>Customer Messages</h2>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>All messages submitted through Contact form appear here in real-time.</p>
              </div>

              <div className="admin-filters-group">
                <input
                  type="text"
                  placeholder="Search name, phone, message..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#15151c',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#f3f4f6',
                    fontSize: '13px',
                    minWidth: '180px',
                  }}
                />

                <select
                  value={contactFilter}
                  onChange={(e) => setContactFilter(e.target.value as any)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#15151c',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#f3f4f6',
                    fontSize: '13px',
                  }}
                >
                  <option value="ALL">All ({contacts.length})</option>
                  <option value="UNREAD">Unread ({unreadCount})</option>
                  <option value="REPLIED">Replied</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="admin-desktop-table" style={{ background: '#15151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
              {filteredContacts.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                  <p style={{ fontSize: '13px' }}>No inquiries found.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Customer</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Contact Details</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, minWidth: '240px' }}>Inquiry / Message</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Received</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#f3f4f6' }}>{c.name}</td>
                          <td style={{ padding: '12px 16px', color: '#d1d5db' }}>
                            <div>📞 {c.phone}</div>
                            {c.email && <div style={{ fontSize: '11px', color: '#9ca3af' }}>✉️ {c.email}</div>}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#d1d5db', lineHeight: '1.4' }}>
                            {c.requirement && (
                              <div style={{ fontSize: '11px', color: '#e2b43b', fontWeight: 600, marginBottom: '2px' }}>
                                Req: {c.requirement}
                              </div>
                            )}
                            <div>{c.message}</div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <select
                              value={c.status}
                              onChange={(e) => handleUpdateContactStatus(c.id, e.target.value as any)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                                background:
                                  c.status === 'UNREAD'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : c.status === 'REPLIED'
                                    ? 'rgba(59, 130, 246, 0.2)'
                                    : 'rgba(34, 197, 94, 0.2)',
                                color:
                                  c.status === 'UNREAD'
                                    ? '#f87171'
                                    : c.status === 'REPLIED'
                                    ? '#60a5fa'
                                    : '#4ade80',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="UNREAD" style={{ background: '#111', color: '#fff' }}>UNREAD</option>
                              <option value="READ" style={{ background: '#111', color: '#fff' }}>READ</option>
                              <option value="REPLIED" style={{ background: '#111', color: '#fff' }}>REPLIED</option>
                              <option value="RESOLVED" style={{ background: '#111', color: '#fff' }}>RESOLVED</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <a
                              href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${c.name}, thank you for contacting Chicksum Fresh Meats Varanasi. Regarding your enquiry: "${c.message}"`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: 'rgba(34, 197, 94, 0.15)',
                                color: '#4ade80',
                                textDecoration: 'none',
                                fontSize: '12px',
                                fontWeight: 600,
                                marginRight: '6px',
                                display: 'inline-block',
                              }}
                            >
                              WhatsApp 💬
                            </a>

                            <button
                              onClick={() => setDeleteConfirmation({ type: 'contact', id: c.id, title: `Message from ${c.name}` })}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                border: 'none',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              Delete 🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Mobile Cards View for Inquiries */}
            <div className="admin-mobile-cards">
              {filteredContacts.length === 0 ? (
                <div style={{ padding: '36px 16px', textAlign: 'center', color: '#9ca3af', background: '#15151c', borderRadius: '12px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>📭</div>
                  <p style={{ fontSize: '13px' }}>No customer inquiries found.</p>
                </div>
              ) : (
                filteredContacts.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      background: '#15151c',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#ffffff' }}>{c.name}</strong>
                        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                          {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <select
                        value={c.status}
                        onChange={(e) => handleUpdateContactStatus(c.id, e.target.value as any)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background:
                            c.status === 'UNREAD'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : c.status === 'REPLIED'
                              ? 'rgba(59, 130, 246, 0.2)'
                              : 'rgba(34, 197, 94, 0.2)',
                          color:
                            c.status === 'UNREAD'
                              ? '#f87171'
                              : c.status === 'REPLIED'
                              ? '#60a5fa'
                              : '#4ade80',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="UNREAD" style={{ background: '#111', color: '#fff' }}>UNREAD</option>
                        <option value="READ" style={{ background: '#111', color: '#fff' }}>READ</option>
                        <option value="REPLIED" style={{ background: '#111', color: '#fff' }}>REPLIED</option>
                        <option value="RESOLVED" style={{ background: '#111', color: '#fff' }}>RESOLVED</option>
                      </select>
                    </div>

                    <div style={{ fontSize: '12.5px', color: '#d1d5db' }}>
                      <a href={`tel:${c.phone}`} style={{ color: '#e2b43b', textDecoration: 'none' }}>
                        📞 {c.phone}
                      </a>
                      {c.email && <span style={{ marginLeft: '10px', color: '#9ca3af', fontSize: '11px' }}>✉️ {c.email}</span>}
                    </div>

                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12.5px', color: '#e5e7eb', lineHeight: '1.4' }}>
                      {c.requirement && (
                        <div style={{ fontSize: '11px', color: '#e2b43b', fontWeight: 600, marginBottom: '3px' }}>
                          Req: {c.requirement}
                        </div>
                      )}
                      <div>{c.message}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${c.name}, thank you for contacting Chicksum Fresh Meats Varanasi. Regarding your enquiry: "${c.message}"`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '6px',
                          background: 'rgba(34, 197, 94, 0.15)',
                          color: '#4ade80',
                          textDecoration: 'none',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>WhatsApp</span>
                        <span>💬</span>
                      </a>

                      <button
                        onClick={() => setDeleteConfirmation({ type: 'contact', id: c.id, title: `Message from ${c.name}` })}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '6px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION: BUSINESS REPORTS & ANALYTICS */}
        {activeTab === 'reports' && (() => {
          // Calculate Real-Time Metrics
          let totalRevenue = 0;
          let codRevenue = 0;
          let upiRevenue = 0;
          let deliveredOrdersCount = 0;
          const customerOrderCounts: Record<string, number> = {};
          const productSalesMap: Record<string, { name: string; category: string; qty: number; revenue: number }> = {};

          orders.forEach((ord: any) => {
            const amount = Number(ord.finalTotal) || 0;
            totalRevenue += amount;
            if (ord.paymentMethod === 'UPI_ON_DELIVERY') {
              upiRevenue += amount;
            } else {
              codRevenue += amount;
            }
            if (ord.status === 'DELIVERED') {
              deliveredOrdersCount += 1;
            }

            // Customer repeat tracking
            const custKey = ord.mobileNumber ? ord.mobileNumber.trim() : ord.customerName;
            if (custKey) {
              customerOrderCounts[custKey] = (customerOrderCounts[custKey] || 0) + 1;
            }

            // Product sales breakdown
            (ord.items || []).forEach((item: any) => {
              const pName = item.name || 'Custom Cut';
              if (!productSalesMap[pName]) {
                productSalesMap[pName] = {
                  name: pName,
                  category: item.category || 'Meat',
                  qty: 0,
                  revenue: 0,
                };
              }
              const itemQty = Number(item.quantity) || 1;
              const itemPrice = Number(item.price) || 0;
              productSalesMap[pName].qty += itemQty;
              productSalesMap[pName].revenue += itemQty * itemPrice;
            });
          });

          const totalUniqueCustomers = Object.keys(customerOrderCounts).length;
          const repeatCustomersCount = Object.values(customerOrderCounts).filter((cnt) => cnt > 1).length;
          const repeatRate = totalUniqueCustomers > 0 ? Math.round((repeatCustomersCount / totalUniqueCustomers) * 100) : 0;

          const topSellingCuts = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty);

          return (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>Business Reports &amp; Analytics</h2>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '3px 0 0' }}>Real-time revenue breakdown, top selling cuts, and customer retention metrics.</p>
              </div>

              {/* 4 Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                <div style={{ background: '#13151d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>Total Revenue</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#e2b43b', fontFamily: 'monospace', marginTop: '4px' }}>
                    ₹{totalRevenue}
                  </div>
                  <span style={{ fontSize: '11px', color: '#4ade80' }}>Across {orders.length} orders</span>
                </div>

                <div style={{ background: '#13151d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>💵 COD vs 📱 UPI Collection</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>₹{codRevenue}</div>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>Cash on Delivery</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>₹{upiRevenue}</div>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>UPI QR Scan</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#13151d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>Customer Repeat Rate</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#4ade80', fontFamily: 'monospace', marginTop: '4px' }}>
                    {repeatRate}%
                  </div>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{repeatCustomersCount} of {totalUniqueCustomers} customers ordered &gt;1 time</span>
                </div>

                <div style={{ background: '#13151d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700 }}>Order Delivery Fulfillment</span>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', marginTop: '4px' }}>
                    {deliveredOrdersCount} / {orders.length}
                  </div>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>Successfully delivered fresh</span>
                </div>
              </div>

              {/* Top Selling Cuts Table */}
              <div style={{ background: '#13151d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '18px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>
                  🏆 Top Selling Cuts &amp; Products
                </h3>
                {topSellingCuts.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>No product sales recorded yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#9ca3af' }}>
                          <th style={{ padding: '8px 6px' }}>#</th>
                          <th style={{ padding: '8px 6px' }}>Cut / Item Name</th>
                          <th style={{ padding: '8px 6px' }}>Category</th>
                          <th style={{ padding: '8px 6px', textAlign: 'center' }}>Units Sold</th>
                          <th style={{ padding: '8px 6px', textAlign: 'right' }}>Total Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topSellingCuts.map((cut, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <td style={{ padding: '10px 6px', color: '#9ca3af' }}>{idx + 1}</td>
                            <td style={{ padding: '10px 6px', color: '#fff', fontWeight: 700 }}>{cut.name}</td>
                            <td style={{ padding: '10px 6px', color: '#e2b43b' }}>{cut.category}</td>
                            <td style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 800, color: '#fff' }}>{cut.qty} packs</td>
                            <td style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 800, color: '#e2b43b', fontFamily: 'monospace' }}>₹{cut.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* SECTION: SERVICEABLE PINCODES & DELIVERY AREAS */}
        {activeTab === 'pincodes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#ffffff' }}>Serviceable PIN Codes &amp; Delivery Areas</h2>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>Add new Varanasi PIN codes or toggle existing delivery sectors.</p>
              </div>
            </div>

            {/* Add New Pincode Form */}
            <form onSubmit={handleAddPincode} style={{
              background: '#15151c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 140px',
              gap: '12px',
              alignItems: 'end'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', fontWeight: 700, marginBottom: '4px' }}>6-DIGIT PIN CODE</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 221009"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#0a0d13',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', fontWeight: 700, marginBottom: '4px' }}>AREA NAME / LANDMARKS</label>
                <input
                  type="text"
                  placeholder="e.g. Ramnagar / Lanka Gate"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#0a0d13',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', fontWeight: 700, marginBottom: '4px' }}>ESTIMATED TIME</label>
                <input
                  type="text"
                  placeholder="e.g. 45-60 mins"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#0a0d13',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: '#e2b43b',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  height: '37px'
                }}
              >
                + Add Area
              </button>
            </form>

            {/* Pincodes List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {Object.entries(storeSettings.pincodes || {}).map(([pin, data]: [string, any]) => {
                const isActive = data.active !== false;
                return (
                  <div
                    key={pin}
                    style={{
                      background: '#13151d',
                      border: `1px solid ${isActive ? 'rgba(255,255,255,0.1)' : 'rgba(239,68,68,0.3)'}`,
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#e2b43b', fontFamily: 'monospace' }}>
                          {pin}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: isActive ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isActive ? '#4ade80' : '#f87171'
                        }}>
                          {isActive ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#fff', fontWeight: 600, marginTop: '3px' }}>
                        {data.area}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                        Delivery Time: {data.time || '45-60 mins'} • Fee: ₹{data.fee || 0}
                      </div>
                    </div>

                    <button
                      onClick={() => handleTogglePincode(pin)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: isActive ? 'rgba(239,68,68,0.15)' : 'rgba(74,222,128,0.15)',
                        color: isActive ? '#f87171' : '#4ade80'
                      }}
                    >
                      {isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      )}

      {/* MODAL: MANAGE CATEGORIES & CREATE CATEGORY */}
      {isManageCategoriesOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 105,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#15151c',
              border: '1px solid rgba(226, 180, 59, 0.3)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '20px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#ffffff' }}>🏷️ Manage Categories</h3>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0' }}>Add new meat categories or delete custom ones.</p>
              </div>
              <button onClick={() => setIsManageCategoriesOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleCreateCategory} style={{ background: '#1c1c26', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2b43b', marginBottom: '10px' }}>➕ Create New Category</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', color: '#9ca3af', display: 'block', marginBottom: '3px' }}>Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eggs &amp; Dairy, Duck, Exotic, Marinades"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#242432', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', color: '#9ca3af', display: 'block', marginBottom: '3px' }}>Short Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Farm-fresh organic country duck and eggs"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: '#242432', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Photo for category */}
                <div>
                  <label style={{ fontSize: '11.5px', color: '#9ca3af', display: 'block', marginBottom: '3px' }}>Category Icon / Photo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {newCategory.image ? (
                      <img src={newCategory.image} alt="Preview" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                    ) : null}
                    <input
                      type="file"
                      ref={categoryFileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDirectImageUpload(file, 'categories', (url) => setNewCategory((prev) => ({ ...prev, image: url })));
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => categoryFileInputRef.current?.click()}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#f3f4f6',
                        fontSize: '11.5px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{uploadingImage ? '⏳...' : '📁 Choose Image from Gallery'}</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '4px',
                    padding: '9px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #e2b43b, #c5972c)',
                    color: '#0d0d12',
                    fontWeight: 700,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save New Category
                </button>
              </div>
            </form>

            {/* Existing Categories List */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px' }}>Existing Categories ({categories.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>🏷️</span>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#f3f4f6' }}>{cat.name}</strong>
                        {cat.description && <div style={{ fontSize: '11px', color: '#9ca3af' }}>{cat.description}</div>}
                      </div>
                    </div>

                    <button
                      onClick={() => setDeleteConfirmation({ type: 'category', id: cat.id, title: `Category "${cat.name}"` })}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '5px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        border: 'none',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT WITH DIRECT GALLERY UPLOAD & AUTO COMPRESSION */}
      {isAddProductOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#15151c',
              border: '1px solid rgba(226, 180, 59, 0.3)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '20px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#ffffff' }}>Add New Meat Cut</h3>
              <button onClick={() => setIsAddProductOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Country Rooster Curry Cut"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* DIRECT GALLERY PHOTO UPLOAD + COMPRESSION */}
              <div style={{ padding: '12px', background: '#1c1c26', borderRadius: '10px', border: '1px dashed rgba(226, 180, 59, 0.35)' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#e2b43b', display: 'block', marginBottom: '8px' }}>
                  📸 Product Photo (Auto-Compressed to WebP) *
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {newProduct.image ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #444' }}
                      />
                    </div>
                  ) : null}

                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <input
                      type="file"
                      ref={addFileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDirectImageUpload(file, 'products', (url) => setNewProduct((prev) => ({ ...prev, image: url })));
                        }
                      }}
                    />

                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => addFileInputRef.current?.click()}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #e2b43b, #c5972c)',
                        color: '#0d0d12',
                        fontWeight: 700,
                        fontSize: '12px',
                        border: 'none',
                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{uploadingImage ? '⏳ Compressing...' : '📁 Choose from Gallery'}</span>
                    </button>

                    {newProduct.image && (
                      <button
                        type="button"
                        onClick={() => setNewProduct((prev) => ({ ...prev, image: '' }))}
                        style={{ marginLeft: '8px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {compressionInfo && (
                  <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '6px', fontWeight: 600 }}>
                    {compressionInfo}
                  </div>
                )}
              </div>

              <div className="modal-grid-row">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', color: '#9ca3af' }}>Category *</label>
                    <button
                      type="button"
                      onClick={() => setIsManageCategoriesOpen(true)}
                      style={{ background: 'none', border: 'none', color: '#e2b43b', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      + New Category
                    </button>
                  </div>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Weight Portion *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 g or 1 kg"
                    value={newProduct.weight}
                    onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div className="modal-grid-row">
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 340"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 390"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div className="modal-grid-row">
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Cut Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Bone-in Curry Cut"
                    value={newProduct.cutType}
                    onChange={(e) => setNewProduct({ ...newProduct, cutType: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Tag / Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Farm Fresh, Bestseller"
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of cut and taste..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #e2b43b, #c5972c)',
                    color: '#0d0d12',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    border: 'none',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                  }}
                >
                  Save to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#e5e7eb',
                    border: 'none',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT WITH DIRECT GALLERY UPLOAD & AUTO COMPRESSION */}
      {editingProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#15151c',
              border: '1px solid rgba(226, 180, 59, 0.3)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '20px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#ffffff' }}>Edit Product #{editingProduct.id}</h3>
              <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* DIRECT GALLERY PHOTO UPLOAD + COMPRESSION FOR EDIT */}
              <div style={{ padding: '12px', background: '#1c1c26', borderRadius: '10px', border: '1px dashed rgba(226, 180, 59, 0.35)' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#e2b43b', display: 'block', marginBottom: '8px' }}>
                  📸 Product Photo (Auto-Compressed to WebP)
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <img
                    src={editingProduct.image}
                    alt="Preview"
                    style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #444' }}
                    onError={(e) => {
                      (e.target as any).src = '/categories/chicken.png';
                    }}
                  />

                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDirectImageUpload(file, 'products', (url) => setEditingProduct((prev) => prev ? { ...prev, image: url } : null));
                        }
                      }}
                    />

                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => editFileInputRef.current?.click()}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #e2b43b, #c5972c)',
                        color: '#0d0d12',
                        fontWeight: 700,
                        fontSize: '12px',
                        border: 'none',
                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{uploadingImage ? '⏳ Compressing...' : '📁 Replace from Gallery'}</span>
                    </button>
                  </div>
                </div>

                {compressionInfo && (
                  <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '6px', fontWeight: 600 }}>
                    {compressionInfo}
                  </div>
                )}
              </div>

              <div className="modal-grid-row">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', color: '#9ca3af' }}>Category</label>
                    <button
                      type="button"
                      onClick={() => setIsManageCategoriesOpen(true)}
                      style={{ background: 'none', border: 'none', color: '#e2b43b', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      + New
                    </button>
                  </div>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Weight</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.weight}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div className="modal-grid-row">
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Original MRP (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div className="modal-grid-row">
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Cut Type</label>
                  <input
                    type="text"
                    value={editingProduct.cutType || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, cutType: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Tag / Badge</label>
                  <input
                    type="text"
                    value={editingProduct.tag || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#20202a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #e2b43b, #c5972c)',
                    color: '#0d0d12',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    border: 'none',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#e5e7eb',
                    border: 'none',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirmation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#15151c',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '14px',
              maxWidth: '400px',
              width: '100%',
              padding: '20px',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f87171', margin: '0 0 6px 0' }}>
              Delete {deleteConfirmation.type.toUpperCase()}?
            </h3>
            <p style={{ fontSize: '12.5px', color: '#9ca3af', margin: '0 0 18px 0', lineHeight: '1.4' }}>
              Are you sure you want to permanently delete <strong>{deleteConfirmation.title}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  if (deleteConfirmation.type === 'product') handleDeleteProduct(Number(deleteConfirmation.id));
                  if (deleteConfirmation.type === 'contact') handleDeleteContact(String(deleteConfirmation.id));
                  if (deleteConfirmation.type === 'category') handleDeleteCategory(Number(deleteConfirmation.id));
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmation(null)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#e5e7eb',
                  border: 'none',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
