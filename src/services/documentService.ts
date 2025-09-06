import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Document } from '../types/database';

export class DocumentService {
  static async uploadDocument(
    file: File,
    orgId: string,
    uploadedBy: string,
    metadata: {
      clientId?: string;
      employeeId?: string;
      category: Document['category'];
      isTemplate?: boolean;
  templateData?: Record<string, unknown>;
    }
  ): Promise<Document> {
    try {
      // Create a unique file path
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = `organizations/${orgId}/documents/${fileName}`;
      
      // Upload file to Firebase Storage
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Get file type
      const fileType = this.getFileType(file.name);
      
      // Create document record in Firestore
      const documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'> = {
        orgId,
        name: file.name,
        type: fileType,
        size: file.size,
        url: downloadURL,
        clientId: metadata.clientId,
        employeeId: metadata.employeeId,
        category: metadata.category,
        isTemplate: metadata.isTemplate || false,
        templateData: metadata.templateData,
        uploadedBy
      };
      
      const docRef = await addDoc(collection(db, 'documents'), {
        ...documentData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return {
        ...documentData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }

  private static getFileType(fileName: string): Document['type'] {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'docx':
      case 'doc':
        return 'docx';
      case 'jpg':
      case 'jpeg':
        return 'jpg';
      case 'png':
        return 'png';
      default:
        return 'pdf'; // Default fallback
    }
  }

  static async getDocument(documentId: string): Promise<Document | null> {
    const docSnap = await getDoc(doc(db, 'documents', documentId));
    if (!docSnap.exists()) return null;
    
    return { ...docSnap.data(), id: docSnap.id } as Document;
  }

  static async getDocumentsByOrganization(orgId: string): Promise<Document[]> {
    const q = query(
      collection(db, 'documents'),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Document));
  }

  static async getDocumentsByClient(clientId: string): Promise<Document[]> {
    const q = query(
      collection(db, 'documents'),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Document));
  }

  static async getDocumentsByEmployee(employeeId: string): Promise<Document[]> {
    const q = query(
      collection(db, 'documents'),
      where('employeeId', '==', employeeId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Document));
  }

  static async getTemplates(orgId: string, category?: Document['category']): Promise<Document[]> {
    let q = query(
      collection(db, 'documents'),
      where('orgId', '==', orgId),
      where('isTemplate', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Document));
  }

  static async updateDocument(documentId: string, updates: Partial<Document>): Promise<void> {
    await updateDoc(doc(db, 'documents', documentId), {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async deleteDocument(documentId: string): Promise<void> {
    const document = await this.getDocument(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, document.url);
      await deleteObject(storageRef);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'documents', documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  static async generateDocumentFromTemplate(
    templateId: string,
  data: Record<string, unknown>,
    orgId: string,
    createdBy: string,
    metadata: {
      clientId?: string;
      employeeId?: string;
      category: Document['category'];
    }
  ): Promise<Document> {
    const template = await this.getDocument(templateId);
    
    if (!template || !template.isTemplate) {
      throw new Error('Template not found');
    }
    
    // This is a simplified implementation
    // In a real application, you would:
    // 1. Download the template file
    // 2. Replace placeholders with actual data
    // 3. Generate a new document (PDF/DOCX)
    // 4. Upload the generated document
    
    // For now, we'll create a copy reference
    const generatedDoc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'> = {
      orgId,
      name: `Generated_${template.name}`,
      type: template.type,
      size: template.size,
      url: template.url, // In real implementation, this would be the new generated document
      clientId: metadata.clientId,
      employeeId: metadata.employeeId,
      category: metadata.category,
      isTemplate: false,
      templateData: data,
      uploadedBy: createdBy
    };
    
    const docRef = await addDoc(collection(db, 'documents'), {
      ...generatedDoc,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...generatedDoc,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async searchDocuments(
    orgId: string, 
    searchTerm: string,
    filters?: {
      category?: Document['category'];
      type?: Document['type'];
      clientId?: string;
      employeeId?: string;
    }
  ): Promise<Document[]> {
    // Start with basic organization filter
    let q = query(
      collection(db, 'documents'),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc')
    );
    
    // Apply additional filters
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters?.clientId) {
      q = query(q, where('clientId', '==', filters.clientId));
    }
    if (filters?.employeeId) {
      q = query(q, where('employeeId', '==', filters.employeeId));
    }
    
    const snapshot = await getDocs(q);
    const allDocuments = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Document));
    
    // Client-side text search (consider using Algolia for production)
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      return allDocuments.filter(doc => 
        doc.name.toLowerCase().includes(lowercaseSearch) ||
        (doc.templateData && JSON.stringify(doc.templateData).toLowerCase().includes(lowercaseSearch))
      );
    }
    
    return allDocuments;
  }

  static async getDocumentStats(orgId: string): Promise<{
    total: number;
    byCategory: Record<Document['category'], number>;
    byType: Record<Document['type'], number>;
    totalSize: number;
    templates: number;
  }> {
    const documents = await this.getDocumentsByOrganization(orgId);
    
    const byCategory = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<Document['category'], number>);
    
    const byType = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<Document['type'], number>);
    
    return {
      total: documents.length,
      byCategory,
      byType,
      totalSize: documents.reduce((sum, doc) => sum + doc.size, 0),
      templates: documents.filter(doc => doc.isTemplate).length
    };
  }
}