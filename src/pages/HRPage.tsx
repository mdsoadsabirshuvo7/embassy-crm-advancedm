import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ExportDropdown } from '@/components/export/ExportDropdown';
import { DepartmentManagement } from '@/components/hr/DepartmentManagement';
import { EmployeeForm } from '@/components/hr/EmployeeForm';
import { PayrollForm } from '@/components/hr/PayrollForm';
import { useData } from '@/contexts/DataContext';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Trash
} from 'lucide-react';

const HRPage: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isPayrollFormOpen, setIsPayrollFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payrollData, setPayrollData] = useState([]);

  // Mock payroll and leave data for demo
  const mockPayrollData = [
    {
      id: 'payroll-001',
      employee: 'Sarah Ahmed',
      baseSalary: 45000,
      bonus: 5000,
      deductions: 2250,
      netPay: 47750,
      status: 'processed'
    },
    {
      id: 'payroll-002', 
      employee: 'Mohammed Khan',
      baseSalary: 38000,
      bonus: 3000,
      deductions: 1900,
      netPay: 39100,
      status: 'processed'
    },
    {
      id: 'payroll-003',
      employee: 'Fatima Rahman', 
      baseSalary: 35000,
      bonus: 2500,
      deductions: 1750,
      netPay: 35750,
      status: 'pending'
    }
  ];

  const mockLeaveRequests = [
    {
      id: 'LR001',
      employee: 'Sarah Ahmed',
      type: 'Annual Leave',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      days: 5,
      status: 'pending',
      reason: 'Family vacation'
    },
    {
      id: 'LR002',
      employee: 'Mohammed Khan',
      type: 'Sick Leave',
      startDate: '2024-01-22',
      endDate: '2024-01-24',
      days: 3,
      status: 'approved',
      reason: 'Medical treatment'
    },
    {
      id: 'LR003',
      employee: 'Fatima Rahman',
      type: 'Personal Leave',
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      days: 2,
      status: 'rejected',
      reason: 'Personal matters'
    }
  ];

  const currentPayrollData = payrollData.length > 0 ? payrollData : mockPayrollData;

  const handleAddEmployee = (employeeData) => {
    addEmployee(employeeData);
    setIsEmployeeFormOpen(false);
  };

  const handleEditEmployee = (employeeData) => {
    if (selectedEmployee) {
      updateEmployee(selectedEmployee.id, employeeData);
      setIsEditEmployeeOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleDeleteEmployee = (employeeId) => {
    deleteEmployee(employeeId);
  };

  const handleAddPayroll = (payrollData) => {
    // In a real app, this would create actual payroll records
    setPayrollData(prev => [...prev, { ...payrollData, id: `payroll-${Date.now()}` }]);
    setIsPayrollFormOpen(false);
  };

  // Calculate stats from real data
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'inactive').length, // Using inactive as on leave for demo
    pendingRequests: mockLeaveRequests.filter(r => r.status === 'pending').length
  };

  const oldPayrollData = [
    {
      employee: 'Sarah Ahmed',
      baseSalary: '45000',
      bonus: '5000',
      deductions: '2250',
      netPay: '47750',
      status: 'processed'
    },
    {
      employee: 'Mohammed Khan',
      baseSalary: '38000',
      bonus: '3000',
      deductions: '1900',
      netPay: '39100',
      status: 'processed'
    },
    {
      employee: 'Fatima Rahman',
      baseSalary: '35000',
      bonus: '2500',
      deductions: '1750',
      netPay: '35750',
      status: 'pending'
    },
    {
      employee: 'Ali Hassan',
      baseSalary: '40000',
      bonus: '0',
      deductions: '2000',
      netPay: '38000',
      status: 'on_hold'
    }
  ];

  const attendance = [
    { month: 'January', present: 20, absent: 2, late: 1, percentage: 91 },
    { month: 'December', present: 19, absent: 1, late: 2, percentage: 95 },
    { month: 'November', present: 21, absent: 1, late: 0, percentage: 95 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'approved': return 'bg-success text-success-foreground';
      case 'processed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'on_leave': return 'bg-warning text-warning-foreground';
      case 'on_hold': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'processed':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
      case 'on_leave':
      case 'on_hold':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'rejected':
      case 'inactive':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">HR Management</h1>
          <p className="text-muted-foreground">
            Comprehensive human resource management system
          </p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            data={employees.map(emp => ({
              'Employee ID': emp.employeeId,
              'User ID': emp.userId,
              'Department': emp.department,
              'Position': emp.position,
              'Status': emp.status
            }))}
            filename="hr_overview"
            title="HR Overview Report"
            headers={['Name', 'Email', 'Department', 'Position', 'Status']}
          />
          <Button size="sm" onClick={() => setIsEmployeeFormOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalEmployees}</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {stats.activeEmployees} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On Leave Today</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.onLeave}</div>
            <p className="text-xs text-muted-foreground">{stats.onLeave} employees</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payroll</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">৳1,284,600</div>
            <p className="text-xs text-success flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              80% processed
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.pendingRequests}</div>
            <p className="text-xs text-warning">{stats.pendingRequests} leave requests</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Department Breakdown</CardTitle>
                <CardDescription>Employee distribution by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Operations</span>
                    <span className="text-sm font-bold">12 employees</span>
                  </div>
                  <Progress value={37.5} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Finance</span>
                    <span className="text-sm font-bold">8 employees</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">HR</span>
                    <span className="text-sm font-bold">5 employees</span>
                  </div>
                  <Progress value={15.6} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">IT</span>
                    <span className="text-sm font-bold">4 employees</span>
                  </div>
                  <Progress value={12.5} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Admin</span>
                    <span className="text-sm font-bold">3 employees</span>
                  </div>
                  <Progress value={9.4} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest HR activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success mt-1" />
                  <div>
                    <p className="text-sm font-medium">Mohammed Khan's leave approved</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserPlus className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium">New employee onboarding started</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-success mt-1" />
                  <div>
                    <p className="text-sm font-medium">January payroll processed</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-warning mt-1" />
                  <div>
                    <p className="text-sm font-medium">Leave request pending approval</p>
                    <p className="text-xs text-muted-foreground">5 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Directory</CardTitle>
                  <CardDescription>Manage employee information and profiles</CardDescription>
                </div>
                <div className="flex gap-2">
                  <ExportDropdown
                    data={employees.map(emp => ({
                      'Employee ID': emp.employeeId,
                      'User ID': emp.userId,
                      'Department': emp.department,
                      'Position': emp.position,
                      'Salary': emp.salary,
                      'Status': emp.status,
                      'Hire Date': new Date(emp.hireDate).toLocaleDateString()
                    }))}
                    filename="employees"
                    title="Employee Directory"
                    headers={['Employee ID', 'User ID', 'Department', 'Position', 'Salary', 'Status', 'Hire Date']}
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" onClick={() => setIsEmployeeFormOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{employee.userId?.split(' ').map(n => n[0]).join('') || employee.employeeId?.substring(0, 2) || 'EM'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.userId || employee.employeeId}</p>
                            <p className="text-xs text-muted-foreground">{employee.position}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{employee.employeeId}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell className="font-mono">{employee.currency === 'BDT' ? '৳' : '$'}{employee.salary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                       <TableCell>
                         <div className="flex gap-2">
                           <Button variant="ghost" size="sm" onClick={() => {
                             setSelectedEmployee(employee);
                             setIsEditEmployeeOpen(true);
                           }}>
                             <Edit className="w-4 h-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                             <Trash className="w-4 h-4" />
                           </Button>
                         </div>
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <DepartmentManagement employees={employees} />
        </TabsContent>

        <TabsContent value="leave" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leave Requests</CardTitle>
                  <CardDescription>Manage employee leave applications</CardDescription>
                </div>
                <div className="flex gap-2">
                  <ExportDropdown
                    data={mockLeaveRequests.map(req => ({
                      'Request ID': req.id,
                      'Employee': req.employee,
                      'Type': req.type,
                      'Start Date': req.startDate,
                      'End Date': req.endDate,
                      'Days': req.days,
                      'Status': req.status,
                      'Reason': req.reason
                    }))}
                    filename="leave_requests"
                    title="Leave Requests Report"
                    headers={['Request ID', 'Employee', 'Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason']}
                  />
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {mockLeaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono">{request.id}</TableCell>
                      <TableCell className="font-medium">{request.employee}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.startDate}</TableCell>
                      <TableCell>{request.endDate}</TableCell>
                      <TableCell>{request.days}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      </TableCell>
                       <TableCell>
                         <div className="flex gap-2">
                           <Button variant="ghost" size="sm" onClick={() => console.log('View leave request', request.id)}>
                             <Eye className="w-4 h-4" />
                           </Button>
                           {request.status === 'pending' && (
                             <>
                               <Button variant="ghost" size="sm" className="text-success" onClick={() => console.log('Approve request', request.id)}>
                                 <CheckCircle className="w-4 h-4" />
                               </Button>
                               <Button variant="ghost" size="sm" className="text-destructive" onClick={() => console.log('Reject request', request.id)}>
                                 <XCircle className="w-4 h-4" />
                               </Button>
                             </>
                           )}
                         </div>
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payroll Management</CardTitle>
                  <CardDescription>Process employee salaries and benefits</CardDescription>
                </div>
                <div className="flex gap-2">
                  <ExportDropdown
                    data={payrollData.map(p => ({
                      'Employee': p.employee,
                      'Base Salary': p.baseSalary,
                      'Bonus': p.bonus,
                      'Deductions': p.deductions,
                      'Net Pay': p.netPay,
                      'Status': p.status
                    }))}
                    filename="payroll"
                    title="Payroll Report"
                    headers={['Employee', 'Base Salary', 'Bonus', 'Deductions', 'Net Pay', 'Status']}
                  />
                  <Button variant="outline" size="sm">
                    Generate Payslips
                  </Button>
                  <Button size="sm">
                    Process Payroll
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((payroll, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{payroll.employee}</TableCell>
                      <TableCell className="font-mono">৳{payroll.baseSalary}</TableCell>
                      <TableCell className="font-mono text-success">৳{payroll.bonus}</TableCell>
                      <TableCell className="font-mono text-destructive">৳{payroll.deductions}</TableCell>
                      <TableCell className="font-mono font-bold">৳{payroll.netPay}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payroll.status)}>
                          {payroll.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendance Overview</CardTitle>
                  <CardDescription>Monthly attendance summary</CardDescription>
                </div>
                <ExportDropdown
                  data={attendance.map(att => ({
                    'Month': att.month,
                    'Present Days': att.present,
                    'Absent Days': att.absent,
                    'Late Arrivals': att.late,
                    'Attendance %': att.percentage
                  }))}
                  filename="attendance"
                  title="Attendance Report"
                  headers={['Month', 'Present Days', 'Absent Days', 'Late Arrivals', 'Attendance %']}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Present Days</TableHead>
                    <TableHead>Absent Days</TableHead>
                    <TableHead>Late Arrivals</TableHead>
                    <TableHead>Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.month}</TableCell>
                      <TableCell className="text-success">{record.present}</TableCell>
                      <TableCell className="text-destructive">{record.absent}</TableCell>
                      <TableCell className="text-warning">{record.late}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={record.percentage} className="h-2 w-16" />
                          <span className="text-sm font-medium">{record.percentage}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Employee Forms */}
      <EmployeeForm
        isOpen={isEmployeeFormOpen}
        onClose={() => setIsEmployeeFormOpen(false)}
        onSubmit={handleAddEmployee}
      />
      
      <EmployeeForm
        employee={selectedEmployee}
        isOpen={isEditEmployeeOpen}
        onClose={() => {
          setIsEditEmployeeOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleEditEmployee}
      />

      <PayrollForm
        employees={employees}
        isOpen={isPayrollFormOpen}
        onClose={() => setIsPayrollFormOpen(false)}
        onSubmit={handleAddPayroll}
      />
    </div>
  );
};

export default HRPage;