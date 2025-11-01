
import React, { createContext, useState, useContext } from 'react';

export type EditMode = 'none' | 'theme' | 'content';

interface EditorContextType {
    editMode: EditMode;
    setEditMode: (mode: EditMode) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [editMode, setEditMode] = useState<EditMode>('none');
    
    return (
        <EditorContext.Provider value={{ editMode, setEditMode }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};
