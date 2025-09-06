import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Settings, GoogleDriveConfig } from '../types/database';

export class SettingsService {
  static async getSettings(orgId: string): Promise<Settings | null> {
    const docSnap = await getDoc(doc(db, 'settings', orgId));
    if (!docSnap.exists()) return null;
    
    return { ...docSnap.data(), id: docSnap.id } as Settings;
  }

  static async createDefaultSettings(orgId: string): Promise<Settings> {
    const defaultSettings: Settings = {
      id: orgId,
      orgId,
      googleDrive: {
        clientId: '',
        clientSecret: '',
        redirectUri: '',
        isEnabled: false
      },
      emailSettings: {
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: ''
      },
      payrollSettings: {
        taxRates: {
          'income_tax': 0.1,
          'social_security': 0.05
        },
        benefits: ['Health Insurance', 'Dental Insurance', 'Retirement Plan'],
        deductions: ['Income Tax', 'Social Security', 'Health Insurance Premium']
      },
      invoiceSettings: {
        prefix: 'INV',
        startNumber: 1000,
        terms: 'Payment due within 30 days',
        footer: 'Thank you for your business!'
      },
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'settings', orgId), defaultSettings);
    return defaultSettings;
  }

  static async updateGoogleDriveSettings(
    orgId: string, 
    googleDriveConfig: Partial<GoogleDriveConfig>
  ): Promise<void> {
    const settings = await this.getSettings(orgId);
    
    if (!settings) {
      throw new Error('Settings not found');
    }

    const updatedGoogleDrive = {
      ...settings.googleDrive,
      ...googleDriveConfig
    };

    await updateDoc(doc(db, 'settings', orgId), {
      googleDrive: updatedGoogleDrive,
      updatedAt: new Date()
    });
  }

  static async updateEmailSettings(
    orgId: string,
    emailSettings: Settings['emailSettings']
  ): Promise<void> {
    await updateDoc(doc(db, 'settings', orgId), {
      emailSettings,
      updatedAt: new Date()
    });
  }

  static async updatePayrollSettings(
    orgId: string,
    payrollSettings: Settings['payrollSettings']
  ): Promise<void> {
    await updateDoc(doc(db, 'settings', orgId), {
      payrollSettings,
      updatedAt: new Date()
    });
  }

  static async updateInvoiceSettings(
    orgId: string,
    invoiceSettings: Settings['invoiceSettings']
  ): Promise<void> {
    await updateDoc(doc(db, 'settings', orgId), {
      invoiceSettings,
      updatedAt: new Date()
    });
  }

  static async uploadBrandingFile(
    orgId: string,
    file: File,
    type: 'logo' | 'letterhead' | 'stamp'
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${type}-${timestamp}-${file.name}`;
      const filePath = `organizations/${orgId}/branding/${fileName}`;
      
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading branding file:', error);
      throw new Error('Failed to upload branding file');
    }
  }

  static async testGoogleDriveConnection(
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<boolean> {
    try {
      // This is a simplified test - in production you would:
      // 1. Make a test API call to Google Drive API
      // 2. Verify the credentials work
      // 3. Check permissions
      
      // For now, just validate the format
      if (!clientId || !clientSecret || !redirectUri) {
        return false;
      }
      
      // Basic format validation
      const isValidClientId = clientId.includes('.googleusercontent.com');
      const isValidRedirectUri = redirectUri.startsWith('http');
      
      return isValidClientId && isValidRedirectUri;
    } catch (error) {
      console.error('Error testing Google Drive connection:', error);
      return false;
    }
  }

  static async enableGoogleDriveSync(orgId: string): Promise<void> {
    await this.updateGoogleDriveSettings(orgId, { isEnabled: true });
  }

  static async disableGoogleDriveSync(orgId: string): Promise<void> {
    await this.updateGoogleDriveSettings(orgId, { 
      isEnabled: false,
      accessToken: undefined,
      refreshToken: undefined
    });
  }

  static async updateGoogleDriveTokens(
    orgId: string,
    accessToken: string,
    refreshToken: string
  ): Promise<void> {
    await this.updateGoogleDriveSettings(orgId, {
      accessToken,
      refreshToken
    });
  }

  // Utility methods for common settings operations
  static async getInvoiceNumber(orgId: string): Promise<string> {
    const settings = await this.getSettings(orgId);
    
    if (!settings) {
      throw new Error('Settings not found');
    }

    const { prefix, startNumber } = settings.invoiceSettings;
    const year = new Date().getFullYear();
    
    // In a real implementation, you would track the last used number
    // For now, using a timestamp-based approach
    const timestamp = Date.now();
    const invoiceNumber = `${prefix}-${year}-${timestamp}`;
    
    return invoiceNumber;
  }

  static async getPayrollTaxRate(orgId: string, taxType: string): Promise<number> {
    const settings = await this.getSettings(orgId);
    
    if (!settings) {
      return 0;
    }

    return settings.payrollSettings.taxRates[taxType] || 0;
  }

  static async addPayrollBenefit(orgId: string, benefit: string): Promise<void> {
    const settings = await this.getSettings(orgId);
    
    if (!settings) {
      throw new Error('Settings not found');
    }

    const updatedBenefits = [...settings.payrollSettings.benefits, benefit];
    
    await this.updatePayrollSettings(orgId, {
      ...settings.payrollSettings,
      benefits: updatedBenefits
    });
  }

  static async removePayrollBenefit(orgId: string, benefit: string): Promise<void> {
    const settings = await this.getSettings(orgId);
    
    if (!settings) {
      throw new Error('Settings not found');
    }

    const updatedBenefits = settings.payrollSettings.benefits.filter(b => b !== benefit);
    
    await this.updatePayrollSettings(orgId, {
      ...settings.payrollSettings,
      benefits: updatedBenefits
    });
  }

  static async updateTaxRate(orgId: string, taxType: string, rate: number): Promise<void> {
    const settings = await this.getSettings(orgId);
    
    if (!settings) {
      throw new Error('Settings not found');
    }

    const updatedTaxRates = {
      ...settings.payrollSettings.taxRates,
      [taxType]: rate
    };
    
    await this.updatePayrollSettings(orgId, {
      ...settings.payrollSettings,
      taxRates: updatedTaxRates
    });
  }
}