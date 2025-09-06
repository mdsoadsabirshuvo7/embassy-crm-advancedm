import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  ArrowRight,
  Target
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: {
    id: string;
    name: string;
    avatar?: string;
  };
  assignedBy: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  createdAt: string;
  labels: string[];
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Process visa application for Ahmed Hassan',
    description: 'Complete visa documentation and submit to embassy',
    assignedTo: { id: '1', name: 'Sarah Ahmed', avatar: '/api/placeholder/32/32' },
    assignedBy: { id: '2', name: 'Mike Manager' },
    client: { id: '1', name: 'Ahmed Hassan' },
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-02-20',
    createdAt: '2024-01-15',
    labels: ['visa', 'urgent']
  },
  {
    id: '2',
    title: 'Document verification for Maria Santos',
    description: 'Verify passport and supporting documents',
    assignedTo: { id: '2', name: 'Mohammed Khan', avatar: '/api/placeholder/32/32' },
    assignedBy: { id: '2', name: 'Mike Manager' },
    client: { id: '2', name: 'Maria Santos' },
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-02-25',
    createdAt: '2024-01-16',
    labels: ['documents']
  },
  {
    id: '3',
    title: 'Embassy appointment booking',
    description: 'Book embassy appointment for client interview',
    assignedTo: { id: '3', name: 'Fatima Rahman', avatar: '/api/placeholder/32/32' },
    assignedBy: { id: '2', name: 'Mike Manager' },
    client: { id: '3', name: 'John Smith' },
    priority: 'urgent',
    status: 'review',
    dueDate: '2024-02-18',
    createdAt: '2024-01-14',
    labels: ['appointment', 'embassy']
  },
  {
    id: '4',
    title: 'Follow up on application status',
    description: 'Check status with embassy and update client',
    assignedTo: { id: '1', name: 'Sarah Ahmed', avatar: '/api/placeholder/32/32' },
    assignedBy: { id: '2', name: 'Mike Manager' },
    client: { id: '4', name: 'Ali Hassan' },
    priority: 'low',
    status: 'completed',
    dueDate: '2024-02-15',
    createdAt: '2024-01-12',
    labels: ['follow-up']
  },
  {
    id: '5',
    title: 'Prepare client meeting presentation',
    description: 'Create presentation for new client onboarding',
    assignedTo: { id: '2', name: 'Mohammed Khan', avatar: '/api/placeholder/32/32' },
    assignedBy: { id: '2', name: 'Mike Manager' },
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-02-22',
    createdAt: '2024-01-17',
    labels: ['presentation', 'meeting']
  },
  {
    id: '6',
    title: 'Update client database',
    description: 'Add new client information and update existing records',
    assignedTo: { id: '4', name: 'Ali Hassan', avatar: '/api/placeholder/32/32' },
    assignedBy: { id: '2', name: 'Mike Manager' },
    priority: 'low',
    status: 'in-progress',
    dueDate: '2024-02-28',
    createdAt: '2024-01-18',
    labels: ['database', 'admin']
  }
];

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assignedTo.id === assigneeFilter;
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    review: filteredTasks.filter(task => task.status === 'review'),
    completed: filteredTasks.filter(task => task.status === 'completed')
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-100 text-slate-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-3 h-3" />;
      case 'high': return <Flag className="w-3 h-3" />;
      case 'medium': return <Target className="w-3 h-3" />;
      case 'low': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  const moveTask = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
    ));
  };

  const TaskCreateModal = () => (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to track progress</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" placeholder="Enter task title..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Task description..." rows={3} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sarah Ahmed</SelectItem>
                  <SelectItem value="2">Mohammed Khan</SelectItem>
                  <SelectItem value="3">Fatima Rahman</SelectItem>
                  <SelectItem value="4">Ali Hassan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ahmed Hassan</SelectItem>
                  <SelectItem value="2">Maria Santos</SelectItem>
                  <SelectItem value="3">John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input type="date" id="dueDate" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="labels">Labels (comma separated)</Label>
            <Input id="labels" placeholder="e.g. visa, urgent, documents" />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          <Button>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <Card className="mb-3 hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          
          <div className="flex items-center justify-between">
            <Badge className={getPriorityColor(task.priority)} variant="secondary">
              {getPriorityIcon(task.priority)}
              <span className="ml-1 capitalize text-xs">{task.priority}</span>
            </Badge>
            
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignedTo.avatar} />
              <AvatarFallback className="text-xs">
                {task.assignedTo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.slice(0, 2).map((label) => (
                <span key={label} className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs">
                  {label}
                </span>
              ))}
              {task.labels.length > 2 && (
                <span className="text-xs text-muted-foreground">+{task.labels.length - 2}</span>
              )}
            </div>
          )}
          
          {task.client && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              {task.client.name}
            </div>
          )}
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const statusColumns = [
    { key: 'todo', title: 'To Do', color: 'border-slate-200' },
    { key: 'in-progress', title: 'In Progress', color: 'border-blue-200' },
    { key: 'review', title: 'Review', color: 'border-yellow-200' },
    { key: 'completed', title: 'Completed', color: 'border-green-200' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
          <p className="text-muted-foreground">Organize and track tasks with Kanban board</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tasksByStatus['in-progress'].length}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{tasksByStatus.completed.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed').length}
            </div>
            <p className="text-xs text-destructive">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="1">Sarah Ahmed</SelectItem>
            <SelectItem value="2">Mohammed Khan</SelectItem>
            <SelectItem value="3">Fatima Rahman</SelectItem>
            <SelectItem value="4">Ali Hassan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {statusColumns.map((column) => (
          <div key={column.key} className="space-y-4">
            <Card className={`border-t-4 ${column.color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {tasksByStatus[column.key as keyof typeof tasksByStatus].length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tasksByStatus[column.key as keyof typeof tasksByStatus].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
                
                {column.key === 'todo' && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 border-dashed" 
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <TaskCreateModal />
    </div>
  );
};

export default TasksPage;