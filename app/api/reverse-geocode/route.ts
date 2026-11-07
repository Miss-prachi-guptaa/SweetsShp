import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("lat"));
  const longitude = Number(request.nextUrl.searchParams.get("lon"));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json({ success: false, error: "Invalid coordinates." }, { status: 400 });
  }

  try {
    const query = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      format: "jsonv2",
      addressdetails: "1",
      zoom: "18",
    });
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${query}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
        "User-Agent": "VindhyavaisiniSweetshop/1.0 (Utkarsh.221005@gmail.com)",
      },
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Geocoder returned ${response.status}`);
    const result = await response.json();
    if (!result?.display_name) throw new Error("No address found");

    return NextResponse.json({
      success: true,
      address: result.display_name,
      landmark: result.address?.neighbourhood || result.address?.suburb || result.address?.village || "",
      pincode: result.address?.postcode || "",
    });
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return NextResponse.json({ success: false, error: "Address could not be detected." }, { status: 502 });
  }
}
