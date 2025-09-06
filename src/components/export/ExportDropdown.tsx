import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileText, File, Table } from 'lucide-react';
import { ExportService, ExportFormat } from '@/services/exportService';

interface ExportDropdownProps {
  data: any[];
  filename: string;
  title: string;
  headers: string[];
  variant?: 'outline' | 'default' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  data,
  filename,
  title,
  headers,
  variant = 'outline',
  size = 'sm'
}) => {
  const handleExport = async (format: ExportFormat) => {
    await ExportService.exportData({
      filename,
      title,
      headers,
      data,
      format
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border border-border shadow-md">
        <DropdownMenuItem onClick={() => handleExport('pdf')} className="hover:bg-accent">
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')} className="hover:bg-accent">
          <File className="w-4 h-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')} className="hover:bg-accent">
          <Table className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};