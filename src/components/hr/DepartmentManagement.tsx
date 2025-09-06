import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Users, DollarSign, Building2 } from 'lucide-react';
import { Department } from '@/types/database';
import { ExportDropdown } from '@/components/export/ExportDropdown';

interface DepartmentManagementProps {
  employees: any[];
}

export const DepartmentManagement: React.FC<DepartmentManagementProps> = ({ employees }) => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'dept-001',
      orgId: 'org-1',
      name: 'Operations',
      description: 'Handles client operations and service delivery',
      managerId: 'emp-001',
      budget: 500000,
      employeeCount: 12,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'dept-002',
      orgId: 'org-1',
      name: 'Finance',
      description: 'Manages financial operations and accounting',
      managerId: 'emp-002',
      budget: 300000,
      employeeCount: 8,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'dept-003',
      orgId: 'org-1',
      name: 'Human Resources',
      description: 'Employee management and organizational development',
      managerId: 'emp-003',
      budget: 200000,
      employeeCount: 5,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'dept-004',
      orgId: 'org-1',
      name: 'Information Technology',
      description: 'Technology infrastructure and support',
      managerId: 'emp-004',
      budget: 400000,
      employeeCount: 4,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'dept-005',
      orgId: 'org-1',
      name: 'Administration',
      description: 'Administrative support and office management',
      budget: 150000,
      employeeCount: 3,
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: '',
    budget: '',
    parentDepartmentId: ''
  });

  const handleSave = () => {
    if (editingDept) {
      // Update existing department
      setDepartments(prev => prev.map(dept => 
        dept.id === editingDept.id 
          ? { ...dept, ...formData, budget: parseFloat(formData.budget), updatedAt: new Date() }
          : dept
      ));
    } else {
      // Create new department
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        orgId: 'org-1',
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || undefined,
        parentDepartmentId: formData.parentDepartmentId || undefined,
        budget: parseFloat(formData.budget),
        employeeCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setDepartments(prev => [...prev, newDept]);
    }
    
    setIsDialogOpen(false);
    setEditingDept(null);
    setFormData({ name: '', description: '', managerId: '', budget: '', parentDepartmentId: '' });
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      managerId: dept.managerId || '',
      budget: dept.budget.toString(),
      parentDepartmentId: dept.parentDepartmentId || ''
    });
    setIsDialogOpen(true);
  };

  const getManagerName = (managerId?: string) => {
    const employee = employees.find(emp => emp.id === managerId);
    return employee ? employee.name : 'Not Assigned';
  };

  const exportData = departments.map(dept => ({
    name: dept.name,
    description: dept.description,
    managerName: getManagerName(dept.managerId),
    employeeCount: dept.employeeCount,
    budget: dept.budget,
    isActive: dept.isActive
  }));

  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Department Management
            </CardTitle>
            <CardDescription>Organize and manage company departments</CardDescription>
          </div>
          <div className="flex gap-2">
            <ExportDropdown
              data={exportData}
              filename="departments"
              title="Departments Report"
              headers={['Name', 'Description', 'Manager', 'Employee Count', 'Budget', 'Status']}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => {
                  setEditingDept(null);
                  setFormData({ name: '', description: '', managerId: '', budget: '', parentDepartmentId: '' });
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingDept ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                  <DialogDescription>
                    {editingDept ? 'Update department information' : 'Create a new department for your organization'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Marketing"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the department"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="manager">Department Manager</Label>
                    <Select value={formData.managerId} onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manager" />
                      </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="none">No Manager</SelectItem>
                         {employees.map((employee) => (
                           <SelectItem key={employee.id} value={employee.id}>
                             {employee.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Annual Budget (BDT)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parent">Parent Department</Label>
                    <Select value={formData.parentDepartmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, parentDepartmentId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent department" />
                      </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="none">No Parent</SelectItem>
                         {departments.filter(d => d.id !== editingDept?.id).map((dept) => (
                           <SelectItem key={dept.id} value={dept.id}>
                             {dept.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      {editingDept ? 'Update' : 'Create'} Department
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">{dept.description}</p>
                  </div>
                </TableCell>
                <TableCell>{getManagerName(dept.managerId)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {dept.employeeCount}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ৳{dept.budget.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={dept.isActive ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                    {dept.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};