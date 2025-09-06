import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Building, 
  Palette, 
  FileText, 
  Cloud, 
  Shield, 
  Users,
  Upload,
  Download,
  Save,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Bell,
  Globe
} from 'lucide-react';
import { OrgCreationForm } from '@/components/organization/OrgCreationForm';
import AdvancedRoadmapPanel from '@/components/settings/AdvancedRoadmapPanel';
import { JoinOrganizationForm } from '@/components/organization/JoinOrganizationForm';
const ModuleManagement = lazy(() => import('../components/settings/ModuleManagement'));
const NotificationCenter = lazy(() => import('../components/notifications/NotificationCenter'));
const AuditLogViewer = lazy(() => import('../components/audit/AuditLogViewer'));
import { useI18n, type Language } from '../contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  // Added 'organizations' so SUPER_ADMIN org management tab works; previously missing which broke navigation.
  const allowedSections = ['general','branding','templates','integrations','modules','notifications','audit','security','organizations','advanced'] as const;
  type Section = typeof allowedSections[number];
  const initialTab = (params.section as Section) && allowedSections.includes(params.section as Section)
    ? params.section as Section
    : 'general';
  const [activeTab, setActiveTab] = useState<Section>(initialTab);
  const [invites, setInvites] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const orgId = localStorage.getItem('activeOrgId');
        if (!orgId) return;
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const q = query(collection(db, 'orgInvitations'), where('orgId', '==', orgId));
        const snap = await getDocs(q);
        if (!active) return;
        const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        rows.sort((a,b) => (b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
        setInvites(rows);
      } catch (e) { console.warn('Invite load failed', e); }
    })();
    return () => { active = false; };
  }, []);

  // Keep active tab in sync when the URL parameter changes (e.g., user navigates via address bar/back/forward)
  React.useEffect(() => {
    const current = params.section as Section | undefined;
    if (!current || !allowedSections.includes(current)) {
      // Redirect invalid sections
      if (current !== undefined) navigate('/settings/general', { replace: true });
      return;
    }
    if (current !== activeTab) {
      setActiveTab(current);
    }
  }, [params.section]);
  const [logoPreview, setLogoPreview] = useState('/api/placeholder/120/60');
  const { language, setLanguage, t, isRTL } = useI18n();

  // Mock data
  const templates = [
    {
      id: 'TPL001',
      name: 'Invoice Template',
      type: 'Invoice',
      lastModified: '2024-01-15',
      status: 'active',
      usage: 156
    },
    {
      id: 'TPL002',
      name: 'Contract Template',
      type: 'Contract',
      lastModified: '2024-01-12',
      status: 'active',
      usage: 89
    },
    {
      id: 'TPL003',
      name: 'Receipt Template',
      type: 'Receipt',
      lastModified: '2024-01-10',
      status: 'draft',
      usage: 45
    }
  ];

  const integrations = [
    {
      name: 'Google Drive',
      description: 'Backup documents to Google Drive',
      status: 'connected',
      lastSync: '2024-01-15 10:30 AM'
    },
    {
      name: 'QuickBooks',
      description: 'Sync accounting data with QuickBooks',
      status: 'disconnected',
      lastSync: 'Never'
    },
    {
      name: 'Slack',
      description: 'Send notifications to Slack channels',
      status: 'connected',
      lastSync: '2024-01-15 09:45 AM'
    }
  ];

  const currencies = [
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-success text-success-foreground';
      case 'draft':
      case 'disconnected':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure your agency settings and preferences
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => {
        if (!allowedSections.includes(val as Section)) return;
        setActiveTab(val as Section);
        navigate(`/settings/${val}`);
      }} className="space-y-6">
  <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          { (user?.role === 'SUPER_ADMIN') && <TabsTrigger value="organizations">Organizations</TabsTrigger> }
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Advanced roadmap content (moved outside TabsList for correct tab behavior) */}
        <TabsContent value="advanced" className="space-y-6">
          <AdvancedRoadmapPanel />
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Agency Information
                </CardTitle>
                <CardDescription>Basic information about your agency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agencyName">Agency Name</Label>
                    <Input id="agencyName" defaultValue="Embassy Services Ltd." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regNumber">Registration Number</Label>
                    <Input id="regNumber" defaultValue="REG-2023-001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    defaultValue="123 Business District, Dhaka-1000, Bangladesh"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+880 1711-123456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="info@embassy.com" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Preferences
                </CardTitle>
                <CardDescription>Configure system behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="asia/dhaka">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia/dhaka">Asia/Dhaka</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="america/new_york">America/New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="bn">🇧🇩 Bengali</SelectItem>
                      <SelectItem value="ar">🇸🇦 Arabic</SelectItem>
                      <SelectItem value="fr">🇫🇷 French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Primary Currency</Label>
                  <Select defaultValue="BDT">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email alerts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Backup</p>
                      <p className="text-sm text-muted-foreground">Daily automatic backups</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Multi-Currency</p>
                      <p className="text-sm text-muted-foreground">Enable multiple currencies</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Brand Identity
                </CardTitle>
                <CardDescription>Customize your agency's visual identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Agency Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-12 bg-muted rounded border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                      <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="primaryColor" 
                      type="color" 
                      defaultValue="#3b82f6" 
                      className="w-12 h-10 p-1 rounded"
                    />
                    <Input defaultValue="#3b82f6" className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="secondaryColor" 
                      type="color" 
                      defaultValue="#64748b" 
                      className="w-12 h-10 p-1 rounded"
                    />
                    <Input defaultValue="#64748b" className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select defaultValue="inter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="open-sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Letterhead & Stamps</CardTitle>
                <CardDescription>Upload official letterhead and stamps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Official Letterhead</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Click to upload letterhead</p>
                    <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Official Stamp</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Click to upload stamp</p>
                    <p className="text-xs text-muted-foreground">PNG with transparent background</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Digital Signature</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Edit className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Click to upload signature</p>
                    <p className="text-xs text-muted-foreground">PNG with transparent background</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Document Templates
                  </CardTitle>
                  <CardDescription>Manage document templates with placeholders</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Type: {template.type}</span>
                          <span>Modified: {template.lastModified}</span>
                          <span>Used: {template.usage} times</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-medium mb-2">Available Placeholders</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                  <code className="bg-muted px-2 py-1 rounded">{'{{client.name}}'}</code>
                  <code className="bg-muted px-2 py-1 rounded">{'{{client.email}}'}</code>
                  <code className="bg-muted px-2 py-1 rounded">{'{{invoice.number}}'}</code>
                  <code className="bg-muted px-2 py-1 rounded">{'{{invoice.amount}}'}</code>
                  <code className="bg-muted px-2 py-1 rounded">{'{{invoice.date}}'}</code>
                  <code className="bg-muted px-2 py-1 rounded">{'{{agency.name}}'}</code>
                  <code className="bg-muted px-2 py-1 rounded">{'{{agency.address}}'}</code>
                  <code className="bg-muted px-2 py-1 rounded">{'{{current.date}}'}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>Connect with external services and APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Cloud className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        <p className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                      {integration.status === 'connected' ? (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync
                          </Button>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Google Drive Configuration</CardTitle>
              <CardDescription>Configure Google Drive API for document backup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input id="clientId" placeholder="Enter Google Drive Client ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input id="clientSecret" type="password" placeholder="Enter Client Secret" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirectUri">Redirect URI</Label>
                <Input id="redirectUri" placeholder="https://yourapp.com/auth/callback" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Backup to Drive</p>
                  <p className="text-sm text-muted-foreground">Automatically backup generated documents</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Suspense fallback={<Card className="p-6">Loading module configuration...</Card>}>
            <ModuleManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Suspense fallback={<Card className="p-6">Loading notifications...</Card>}>
            <NotificationCenter />
          </Suspense>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Suspense fallback={<Card className="p-6">Loading audit logs...</Card>}>
            <AuditLogViewer />
          </Suspense>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Manage Organizations
                </CardTitle>
                <CardDescription>Create or join additional organizations (multi-tenant).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <React.Suspense fallback={<div>Loading...</div>}>
                    {/* Lightweight forms */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Create</h4>
                      <div>
                        {/* Lazy inline import to avoid bundling overhead not required now */}
                        <OrgCreationForm />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Join</h4>
                      <JoinOrganizationForm />
                    </div>
                  </React.Suspense>
                </div>
                <div className="pt-4 border-t border-border/40 space-y-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Pending Invitations</h4>
                      <button
                        className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:opacity-90"
                        onClick={async () => {
                          const email = prompt('Invite email?');
                          if (!email) return;
                          const role = prompt('Role (e.g., member)?', 'member') || 'member';
                          try {
                            // dynamic import to avoid baseline bundle cost
                            const { InvitationService } = await import('@/services/invitationService');
                            const orgId = localStorage.getItem('activeOrgId');
                            if (!orgId) { alert('No active org'); return; }
                            const inv = await InvitationService.inviteUser(orgId, email, role);
                            setInvites(prev => [inv, ...prev]);
                          } catch (e) {
                            console.error(e); alert('Failed to send invite');
                          }
                        }}
                      >Invite</button>
                    </div>
                    <div className="border rounded-md divide-y">
                      {invites.length === 0 && <div className="p-3 text-xs text-muted-foreground">No pending invitations</div>}
                      {invites.map(inv => (
                        <div key={inv.id} className="p-3 flex items-center justify-between gap-4 text-sm">
                          <div className="space-y-0.5">
                            <div className="font-medium">{inv.email}</div>
                            <div className="text-xs text-muted-foreground flex gap-2 flex-wrap">
                              <span>{inv.role}</span>
                              <span>Status: {inv.status}</span>
                              <span>Token: <code className="bg-muted px-1 rounded">{inv.token}</code></span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {inv.status === 'pending' && (
                              <button
                                className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground hover:opacity-90"
                                onClick={async () => {
                                  try {
                                    const { InvitationService } = await import('@/services/invitationService');
                                    await InvitationService.revokeInvitation(inv.id!);
                                    setInvites(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'revoked' } : i));
                                  } catch (e) { console.error(e); alert('Failed'); }
                                }}
                              >Revoke</button>
                            )}
                            {inv.status === 'pending' && (
                              <button
                                className="text-xs px-2 py-1 rounded border hover:bg-muted"
                                onClick={async () => {
                                  try {
                                    // For now just copy token to clipboard
                                    await navigator.clipboard.writeText(inv.token);
                                    alert('Token copied');
                                  } catch { alert('Copy failed'); }
                                }}
                              >Copy Token</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security layer</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">IP Whitelist</p>
                    <p className="text-sm text-muted-foreground">Restrict access by IP address</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Audit Logging</p>
                    <p className="text-sm text-muted-foreground">Log all user activities</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default User Role</Label>
                  <Select defaultValue="employee">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-approve Registrations</p>
                    <p className="text-sm text-muted-foreground">Automatically approve new users</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-muted-foreground">Require email verification</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span>Require uppercase letters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span>Require numbers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span>Require special characters</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Your current plan and usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Plan</span>
                  <Badge variant="secondary">Enterprise</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Monthly Cost</span>
                  <span className="font-bold">$99/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Next Billing</span>
                  <span>February 15, 2024</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Users</span>
                    <span>32/50</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span>45GB/100GB</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Calls</span>
                    <span>8.5K/10K</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Payment method and billing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Billing Email</Label>
                  <Input defaultValue="billing@embassy.com" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex items-center gap-2 p-3 border border-border rounded-lg">
                    <div className="w-8 h-5 bg-primary rounded flex items-center justify-center text-xs text-white font-bold">
                      VISA
                    </div>
                    <span className="text-sm">•••• •••• •••• 1234</span>
                    <span className="text-sm text-muted-foreground ml-auto">Expires 12/26</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Billing Address</Label>
                  <Textarea 
                    defaultValue="123 Business District, Dhaka-1000, Bangladesh"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Update Payment Method
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Download Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;