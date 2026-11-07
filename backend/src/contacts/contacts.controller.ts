import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit new contact form message' })
  @ApiResponse({ status: 201, description: 'Message saved successfully' })
  create(@Body() body: { name: string; phone: string; email?: string; message: string; subject?: string }) {
    return this.contactsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contact form messages' })
  findAll() {
    return this.contactsService.findAll();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update contact inquiry status' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    return this.contactsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact message' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.remove(id);
  }
}
