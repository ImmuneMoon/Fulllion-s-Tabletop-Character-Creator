
"use client";

import { useState, useRef, useEffect, type ChangeEvent, type CSSProperties } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SheetField {
  style?: CSSProperties;
  id: string;
  label: string;
  type: 'input' | 'textarea' | 'checkbox';
  x: number; // percentage
  y: number; // percentage
  width?: number; // percentage - optional for checkbox
  height?: number; // percentage (for textarea or input)
  placeholder?: string;
  maxLength?: number;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
}

const initialFields: SheetField[] = [
  { id: 'characterName', label: 'Character Name', type: 'input', x: 6.35, y: 5.75, width: 87, placeholder: 'Eldrin Lightbringer', fontSize: '18px', textAlign: 'center', maxLength: 30 },
  { id: 'classLevel', label: 'Class & Level', type: 'input', x: 25, y: 9, width: 14, placeholder: 'Paladin 5', fontSize: '12px', textAlign: 'center', maxLength: 20 },
  { id: 'background', label: 'Background', type: 'input', x: 43, y: 9, width: 14, placeholder: 'Outlander', fontSize: '12px', textAlign: 'center', maxLength: 20 },
  { id: 'playerName', label: 'Player Name', type: 'input', x: 61, y: 9, width: 14, placeholder: 'Player', fontSize: '12px', textAlign: 'center', maxLength: 20 },
  { id: 'race', label: 'Race', type: 'input', x: 25, y: 12.25, width: 14, placeholder: 'Human', fontSize: '12px', textAlign: 'center', maxLength: 20 },
  { id: 'alignment', label: 'Alignment', type: 'input', x: 43, y: 12.25, width: 14, placeholder: 'Lawful Good', fontSize: '12px', textAlign: 'center', maxLength: 20 },
  { id: 'experience', label: 'EXP', type: 'input', x: 61, y: 12.25, width: 14, placeholder: ' 6,500', fontSize: '12px', textAlign: 'center', maxLength: 20 },

  { id: 'inspiration', label: 'Inspiration', type: 'input', x: 5.25, y: 11.35, width: 5.5, placeholder: '0', fontSize: '20px', textAlign: 'center', maxLength: 5 },
  { id: 'proficiencyBonus', label: 'Proficiency Bonus', type: 'input', x: 11.75, y: 11.35, width: 5.5, placeholder: '+3', fontSize: '20px', textAlign: 'center', maxLength: 3 },
  { id: 'initiative', label: 'Initiative', type: 'input', x: 18, y: 11.35, width: 5.5, placeholder: '+1', fontSize: '20px', textAlign: 'center', maxLength: 3 },

  { id: 'hitPoints', label: 'Total Hit Points', type: 'input', x: 76.35, y: 11.35, width: 5.5, placeholder: '45', fontSize: '20px', textAlign: 'center', maxLength: 10 },
  { id: 'tempHP', label: 'Temp Hit Points', type: 'input', x: 82.95, y: 11.35, width: 5.5, placeholder: '0', fontSize: '20px', textAlign: 'center', maxLength: 10 },
  { id: 'armorClass', label: 'Armor Class', type: 'input', x: 89.15, y: 11.35, width: 5.5, placeholder: '18', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'speed', label: 'Speed', type: 'input', x: 86.92, y: 18.35, width: 5.5, placeholder: '30ft', fontSize: '16px', textAlign: 'center', maxLength: 5 },
  
  { id: 'currHP', label: 'Current Hit Points', type: 'textarea', x: 67.75, y: 18, width: 16.75, height: 5.5, placeholder: '45', fontSize: '18px', textAlign: 'center', maxLength: 21, style: {height: '56px'} },
  { id: 'hitDice', label: 'Hit Dice', type: 'input', x: 67.75, y: 26.25, width: 12.45, height: 2, placeholder: '5d10', fontSize: '12px', textAlign: 'center', maxLength: 10, style: {fontSize: '12px'} },
  { id: 'totalHitDice', label: 'Total Hit Dice', type: 'input', x: 67.75, y: 29.35, width: 12.45, height: 2, placeholder: '5d10', fontSize: '12px', textAlign: 'center', maxLength: 10, style: {fontSize: '12px'} },

  { id: 'strength', label: 'Strength', type: 'input', x: 6, y: 20, width: 6, placeholder: '16', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'strBonus', label: 'Str Bonus', type: 'input', x: 6, y: 23, width: 6, placeholder: '+ 0', fontSize: '16px', textAlign: 'center', maxLength: 2 },
  { id: 'constitution', label: 'Constitution', type: 'input', x: 6, y: 29, width: 6, placeholder: '14', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'conBonus', label: 'Con Bonus', type: 'input', x: 6, y: 32, width: 6, placeholder: '+ 0', fontSize: '16px', textAlign: 'center', maxLength: 2 },
  { id: 'wisdom', label: 'Wisdom', type: 'input', x: 6, y: 38, width: 6, placeholder: '13', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'wisBonus', label: 'Wis Bonus', type: 'input', x: 6, y: 41, width: 6, placeholder: '+ 0', fontSize: '16px', textAlign: 'center', maxLength: 2 },
  { id: 'dexterity', label: 'Dexterity', type: 'input', x: 16.5, y: 20, width: 6, placeholder: '12', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'dexBonus', label: 'Dex Bonus', type: 'input', x: 16.5, y: 23, width: 6, placeholder: '+ 0', fontSize: '16px', textAlign: 'center', maxLength: 2 },
  { id: 'intelligence', label: 'Intelligence', type: 'input', x: 16.5, y: 29, width: 6, placeholder: '10', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'intBonus', label: 'Int Bonus', type: 'input', x: 16.5, y: 32, width: 6, placeholder: '+ 0', fontSize: '16px', textAlign: 'center', maxLength: 2 },
  { id: 'charisma', label: 'Charisma', type: 'input', x: 16.5, y: 38, width: 6, placeholder: '15', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'chaBonus', label: 'Cha Bonus', type: 'input', x: 16.5, y: 41, width: 6, placeholder: '+ 0', fontSize: '16px', textAlign: 'center', maxLength: 2 },
  { id: 'passivePerception', label: 'Passive Wisdom (Perception)', type: 'input', x: 5.75, y: 46, width: 4, placeholder: '0', fontSize: '20px', textAlign: 'center', maxLength: 2 },

  { id: 'strSave_check', label: 'StrSave_check', type: 'checkbox', x: 27, y: 18.5 },
  { id: 'dexSave_check', label: 'DexSave_check', type: 'checkbox', x: 27, y: 20.35 },
  { id: 'conSave_check', label: 'ConSave_check', type: 'checkbox', x: 27, y: 22.25 },
  { id: 'intSave_check', label: 'IntSave_check', type: 'checkbox', x: 27, y: 24.15 },
  { id: 'wisSave_check', label: 'WisSave_check', type: 'checkbox', x: 27, y: 26.05 },
  { id: 'chaSave_check', label: 'ChaSave_check', type: 'checkbox', x: 27, y: 27.9 },

  { id: 'strSave', label: 'StrSave', type: 'input', x: 29.5, y: 18.25, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'dexSave', label: 'DexSave', type: 'input', x: 29.5, y: 20.15, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'conSave', label: 'ConSave', type: 'input', x: 29.5, y: 22.05, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'intSave', label: 'IntSave', type: 'input', x: 29.5, y: 23.95, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'wisSave', label: 'WisSave', type: 'input', x: 29.5, y: 25.85, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'chaSave', label: 'ChaSave', type: 'input', x: 29.5, y: 27.7, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },

  { id: 'acrobat_check', label: 'Acrobatics_check', type: 'checkbox', x: 48.25, y: 18.5 },
  { id: 'animalHandle_check', label: 'AnimalHandling_check', type: 'checkbox', x: 48.25, y: 20.35 },
  { id: 'arcana_check', label: 'Arcana_check', type: 'checkbox', x: 48.25, y: 22.25 },
  { id: 'athletics_check', label: 'Athletics_check', type: 'checkbox', x: 48.25, y: 24.15 },
  { id: 'deception_check', label: 'Deception_check', type: 'checkbox', x: 48.25, y: 26 },
  { id: 'insight_check', label: 'Insight_check', type: 'checkbox', x: 48.25, y: 27.95 },
  { id: 'intimidate_check', label: 'Intimidation_check', type: 'checkbox', x: 48.25, y: 29.85 },
  { id: 'investigate_check', label: 'Investigation_check', type: 'checkbox', x: 48.25, y: 31.7 },
  { id: 'medicine_check', label: 'Medicine_check', type: 'checkbox', x: 48.25, y: 33.65 },
  { id: 'nature_check', label: 'Nature_check', type: 'checkbox', x: 48.25, y: 35.5 },
  { id: 'perception_check', label: 'Perception_check', type: 'checkbox', x: 48.25, y: 37.4 },
  { id: 'perform_check', label: 'Performance_check', type: 'checkbox', x: 48.25, y: 39.25 },
  { id: 'persuasion_check', label: 'Persuasion_check', type: 'checkbox', x: 48.25, y: 41.15 },
  { id: 'religion_check', label: 'Religion_check', type: 'checkbox', x: 48.25, y: 43 },
  { id: 'sleightOfHand_check', label: 'Sleight Of Hand_check', type: 'checkbox', x: 48.25, y: 44.85 },
  { id: 'stealth_check', label: 'Stealth_check', type: 'checkbox', x: 48.25, y: 46.75 },
  { id: 'survival_check', label: 'Survival_check', type: 'checkbox', x: 48.25, y: 48.65 },

  { id: 'acrobat', label: 'Acrobatics', type: 'input', x: 50.75, y: 18.25, width: 3, placeholder: '', fontSize: '12px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'animalHandle', label: 'AnimalHandling', type: 'input', x: 50.75, y: 20.15, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'arcana', label: 'Arcana', type: 'input', x: 50.75, y: 22.05, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'athletics', label: 'Athletics', type: 'input', x: 50.75, y: 23.95, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'deception', label: 'Deception', type: 'input', x: 50.75, y: 25.85, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'insight', label: 'Insight', type: 'input', x: 50.75, y: 27.7, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'intimidate', label: 'Intimidation', type: 'input', x: 50.75, y: 29.6, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'investigate', label: 'Investigation', type: 'input', x: 50.75, y: 31.5, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'medicine', label: 'Medicine', type: 'input', x: 50.75, y: 33.4, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'nature', label: 'Nature', type: 'input', x: 50.75, y: 35.3, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'perceptionSkillModifier', label: 'Perception Skill Modifier', type: 'input', x: 50.75, y: 37.2, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'perform', label: 'Performance', type: 'input', x: 50.75, y: 39.1, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'persuasion', label: 'Persuasion', type: 'input', x: 50.75, y: 41, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'religion', label: 'Religion', type: 'input', x: 50.75, y: 42.9, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'sleightOfHand', label: 'Sleight Of Hand', type: 'input', x: 50.75, y: 44.8, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'stealth', label: 'Stealth', type: 'input', x: 50.75, y: 46.7, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },
  { id: 'survival', label: 'Survival', type: 'input', x: 50.75, y: 48.6, width: 3, placeholder: '', fontSize: '8px', textAlign: 'center', maxLength: 2, style: { height: '16px', fontSize: '12px', lineHeight: '12px', minHeight: '0px', padding: '0px' } },

  { id: 'deathSaveSuccess1', label: 'Death Save Success 1', type: 'checkbox', x: 88.3, y: 27 },
  { id: 'deathSaveSuccess2', label: 'Death Save Success 2', type: 'checkbox', x: 90.4, y: 27 },
  { id: 'deathSaveSuccess3', label: 'Death Save Success 3', type: 'checkbox', x: 92.5, y: 27 },
  { id: 'deathSaveFail1', label: 'Death Save Fail 1', type: 'checkbox', x: 88.3, y: 28.85 },
  { id: 'deathSaveFail2', label: 'Death Save Fail 2', type: 'checkbox', x: 90.4, y: 28.85 },
  { id: 'deathSaveFail3', label: 'Death Save Fail 3', type: 'checkbox', x: 92.5, y: 28.85 },

  { id: 'featsTraits', label: 'Feats & Traits', type: 'textarea', x: 5.5, y: 53, width: 28, height: 20, placeholder: 'Additional traits...', fontSize: '10px' },
  { id: 'otherProf', label: 'Other Proficiencies', type: 'textarea', x: 5.5, y: 75.75, width: 28, height: 19, placeholder: 'Common, Elvish, Dwarvish...', fontSize: '10px' },

  { id: 'copper', label: 'Copper', type: 'input', x: 36.85, y: 53.5, width: 6, placeholder: '0', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'silver', label: 'Silver', type: 'input', x: 36.85, y: 56.75, width: 6, placeholder: '0', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'electrum', label: 'Electrum', type: 'input', x: 36.85, y: 60, width: 6, placeholder: '0', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'gold', label: 'gold', type: 'input', x: 36.85, y: 63.25, width: 6, placeholder: '0', fontSize: '20px', textAlign: 'center', maxLength: 2 },
  { id: 'platinum', label: 'Platinum', type: 'input', x: 36.85, y: 66.5, width: 6, placeholder: '0', fontSize: '20px', textAlign: 'center', maxLength: 2 },


  { id: 'attacks', label: 'Attacks', type: 'textarea', x: 68, y: 35, width: 27, height: 18, placeholder: '', fontSize: '10px' },
  { id: 'equipment', label: 'Equipment', type: 'textarea', x: 44, y: 53.5, width: 21, height: 17, placeholder: 'Longsword, Shield, Holy Symbol...', fontSize: '10px' },
  { id: 'equipment2', label: 'Equipment', type: 'textarea', x: 37, y: 70, width: 28, height: 24, placeholder: 'Bag of holding, Cursed artifact, Backpack with rations...', fontSize: '10px' },
  { id: 'spells', label: 'Spellcasting', type: 'textarea', x: 68, y: 55, width: 27, height: 40, placeholder: 'Divine Smite, Lay on Hands, Aura of Protection...', fontSize: '10px' },
  { id: 'notes', label: 'Character Notes', type: 'textarea', x: 26, y: 32, width: 18, height: 20, placeholder: 'Backstory elements, goals, allies...', fontSize: '10px' },
];


export default function SheetForgePage() {
  const [formData, setFormData] = useState<Record<string, string | boolean>>(
    initialFields.reduce((acc, field) => {
      acc[field.id] = field.type === 'checkbox' ? false : '';
      return acc;
    }, {} as Record<string, string | boolean>)
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetDisplayContainerRef = useRef<HTMLDivElement>(null);

  const sheetBaseDimensions = { width: 850, height: 1100 };
  const sheetImageUrl = "/assets/character_sheet_template.png"; 

  const handleInputChange = (fieldId: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  useEffect(() => {
    const calculateScale = () => {
      if (sheetRef.current && sheetDisplayContainerRef.current) {
        const containerWidth = sheetDisplayContainerRef.current.offsetWidth;
        const actualSheetWidth = sheetBaseDimensions.width;

        let scale = 1;
        if (containerWidth < actualSheetWidth) {
          scale = containerWidth / actualSheetWidth;
        }

        scale = Math.max(scale, 0.2);

        sheetRef.current.style.transform = `scale(${scale})`;
        sheetRef.current.style.transformOrigin = 'top left';
        sheetDisplayContainerRef.current.style.height = `${sheetBaseDimensions.height * scale}px`;
      }
    };

    calculateScale();

    const imageElement = sheetRef.current?.querySelector('img');
    if (imageElement) {
        if (imageElement.complete) {
            calculateScale();
        } else {
            imageElement.onload = calculateScale;
        }
    }


    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);


  const generatePdf = async () => {
    if (!sheetRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const imageElement = sheetRef.current.querySelector('img');
      if (imageElement && !imageElement.complete) {
        await new Promise((resolve, reject) => {
          imageElement.onload = resolve;
          imageElement.onerror = (err) => {
            console.error("Image failed to load for PDF generation:", err);
            reject(new Error("Image load failed for PDF"));
          };
          setTimeout(() => reject(new Error("Image load timeout for PDF")), 5000);
        });
      }

      const response = await fetch(sheetImageUrl);
      const blob = await response.blob();
      const imgData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const pdf = new jsPDF({
        orientation: sheetBaseDimensions.width > sheetBaseDimensions.height ? 'l' : 'p',
        unit: 'px',
        format: [sheetBaseDimensions.width, sheetBaseDimensions.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, sheetBaseDimensions.width, sheetBaseDimensions.height);
      pdf.setTextColor(0, 0, 0); // Set text color to black
      
      // Base font size for PDF relative to sheet height (adjust as needed)
      const pdfBaseFontSize = sheetBaseDimensions.height / 100;


      initialFields.forEach(field => {
        const fieldValue = formData[field.id];

        if (field.type === 'input' || field.type === 'textarea') {
          // Use formData value if present and not empty, otherwise use placeholder
          const textContent = (fieldValue !== undefined && fieldValue !== null && String(fieldValue).length > 0)
            ? String(fieldValue)
            : (field.placeholder || ''); // Use placeholder if formData is empty

          const fieldX = (field.x / 100) * sheetBaseDimensions.width;
          const fieldY = (field.y / 100) * sheetBaseDimensions.height;
          const fieldWidth = (field.width !== undefined ? field.width / 100 : 0) * sheetBaseDimensions.width;
          
          // For height, ensure fieldHeightPercent is a number, defaulting if necessary
          let fieldHeightPercent = typeof field.height === 'number' ? field.height : 0;
          if(field.type === 'input' && fieldHeightPercent === 0) fieldHeightPercent = 2.5; // Default height for input
          if(field.type === 'textarea' && !fieldHeightPercent) fieldHeightPercent = 5; // Default height for textarea

          const fieldHeight = (fieldHeightPercent / 100) * sheetBaseDimensions.height;

          
          const fieldFontSize = (field.fontSize && !isNaN(parseFloat(field.fontSize))) ? parseFloat(field.fontSize) : pdfBaseFontSize;
          
          pdf.setFontSize(fieldFontSize);
          pdf.setFont("helvetica");

          // Vertical alignment adjustment: try to center text in the field or align top
          // This is a common adjustment; actual ideal offset might vary slightly by font
          const textVerticalOffset = fieldFontSize * 0.8; // Heuristic for baseline adjustment
          let textY = fieldY + textVerticalOffset + (fieldFontSize * 0.7); // Default to top alignment + offset, shifted down

          // Apply additional downward offset for specific fields
          const fieldsWithExtraOffset = ['characterName', 'classLevel', 'background', 'playerName', 'race', 'alignment', 'experience'];
          if (fieldsWithExtraOffset.includes(field.id)) { 
 textY += 3; // Increased offset
          }

          // Apply upward offset for specific fields
          const fieldsWithUpwardOffset = ['inspiration', 'proficiencyBonus', 'initiative', 'hitPoints', 'tempHP', 'armorClass'];
          if (fieldsWithUpwardOffset.includes(field.id)) {
 textY -= fieldFontSize * 0.5; // Raise text by half font height
          }


          if (field.type === 'textarea') {
             // Adjust fieldX for text alignment and add padding
             let adjustedFieldX = fieldX;
             const padding = fieldWidth * 0.02; // 2% padding on each side
             const contentWidth = fieldWidth - 2 * padding;
             const lines = pdf.splitTextToSize(textContent, fieldWidth);
             if (field.textAlign === 'center') {
                 // jsPDF's 'center' align centers the whole block, not each line within maxWidth,
                 // so we shift the starting X position
                 adjustedFieldX = fieldX + fieldWidth / 2;
             }
             textY = fieldY + fieldFontSize * 0.8; // Start text a bit lower for multi-line (baseline adjustment)
             pdf.text(lines, adjustedFieldX, textY, {
                align: field.textAlign || 'left',
                maxWidth: fieldWidth,
             });
          } else { // input
            // For single-line inputs, try to center vertically if possible, or ensure top alignment
            let textX = fieldX;
            if (field.textAlign === 'center') {
              const textWidth = pdf.getTextWidth(textContent);
              textX = fieldX + (fieldWidth - textWidth) / 2;
            } else if (field.textAlign === 'right') {
              const textWidth = pdf.getTextWidth(textContent);
              textX = fieldX + fieldWidth - textWidth;
            }
            pdf.text(textContent, textX, textY, {
              align: 'left', // Alignment handled by textX calculation for inputs
              maxWidth: fieldWidth,
            });
          }
        } else if (field.type === 'checkbox' && fieldValue === true) {
            const checkboxSize = sheetBaseDimensions.width * 0.01; // Example: 1% of sheet width (adjust if needed)

            let checkboxX = (field.x / 100) * sheetBaseDimensions.width;
            let checkboxY = (field.y / 100) * sheetBaseDimensions.height + (checkboxSize * 0.25); // Lower checkbox by quarter height
            
            checkboxX += (checkboxSize * 0.25); // Increased small shift to the right
            pdf.setFillColor(0, 0, 0); // Black fill for checked checkbox
            pdf.circle(checkboxX + checkboxSize / 2, checkboxY + checkboxSize / 2, checkboxSize / 2, 'F');
        }
      });
      
      pdf.save('SheetForge-Character.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const commonInputClass = "bg-transparent border border-input placeholder:text-muted-foreground/70 p-1 leading-tight rounded-[2px] outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 text-black";


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 sm:py-10 px-4">
      <header className="mb-6 sm:mb-8 text-center">
        {/* Wrap NextImage in a div to control size with 'fill' */}
        <div className="mx-auto block relative" style={{ width: "auto", height: "300px" }}>
          <NextImage
            src="/assets/SheetForge.png"
            alt="SheetForge Logo"
            fill // Use fill to make the image size based on the parent div
            priority
            unoptimized
          />
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Craft your character, print your legend.</p>
      </header>
      
      <div ref={sheetDisplayContainerRef} className="w-full max-w-4xl mx-auto mb-6 sm:mb-8" style={{ overflow: 'hidden' }}>
        <div
          ref={sheetRef}
          className="relative shadow-2xl rounded-md overflow-hidden bg-white" 
          style={{
            width: `${sheetBaseDimensions.width}px`,
            height: `${sheetBaseDimensions.height}px`,
          }}
        >
          <NextImage
            src={sheetImageUrl}
            alt="Character Sheet Template"
            fill
            priority
            className="absolute inset-0 pointer-events-none -z-10"
            data-ai-hint="character sheet scroll"
            unoptimized 
            onLoad={() => {
                if(sheetRef.current) sheetRef.current.style.backgroundColor = 'transparent';
            }}
            onError={(e) => {
                console.error("Image failed to load on page:", e.currentTarget.currentSrc);
                if(sheetRef.current) sheetRef.current.style.backgroundColor = 'white'; // Fallback for image error
            }}
          />
          {initialFields.map(field => {
            const fieldStyle: React.CSSProperties = {
              position: 'absolute',
              left: `${field.x}%`,
              top: `${field.y}%`,
              width: field.width ? `${field.width}%` : (field.type === 'checkbox' ? '1.5%' : 'auto'), 
              boxSizing: 'border-box',
              ...(field.style?.height && { height: typeof field.style.height === 'number' ? `${field.style.height}px` : field.style.height }),

            };

            if (field.fontSize) fieldStyle.fontSize = field.fontSize;
            if (field.textAlign) fieldStyle.textAlign = field.textAlign;


             if (field.type === 'input' && field.height) {
              fieldStyle.height = `${field.height}%`;
            }
            

            if (field.type === 'checkbox') {
              return (
                <div key={field.id} style={fieldStyle} className="flex items-center justify-center">
                   <Checkbox
                    id={field.id}
                    checked={!!formData[field.id]}
                    onCheckedChange={(checked: boolean | 'indeterminate') => handleInputChange(field.id, !!checked)}
                    aria-label={field.label}
                    className="h-3 w-3 rounded-full border-muted-foreground data-[state=checked]:bg-black data-[state=checked]:border-black" 
                    style={{ zIndex: 1 }} 
                  />
                </div>
              );
            }


            return (
              <div key={field.id} style={fieldStyle}>
                {field.type === 'input' ? (
                  <Input
                    id={field.id}
                    type="text"
                    value={String(formData[field.id] || '')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    aria-label={field.label}
                    maxLength={field.maxLength}
                    className={`w-full h-full ${commonInputClass}`} 
                    style={{
                        fontSize: 'inherit', 
                        textAlign: 'inherit', 
                        backgroundColor: 'transparent', 
                        ...(field.style || {}) 
                    }}
                  />
                ) : ( 
                  <Textarea
                    id={field.id}
                    value={String(formData[field.id] || '')}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    aria-label={field.label}
                    maxLength={field.maxLength}
                    className={`w-full h-full resize-none ${commonInputClass}`} 
                    style={{
                        fontSize: 'inherit',
                        textAlign: 'inherit',
                        backgroundColor: 'transparent',
                        ...(field.style || {})
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={generatePdf}
          disabled={isGeneratingPdf}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/50 transition-shadow duration-300"
          aria-live="polite"
        >
          {isGeneratingPdf ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Download className="mr-2 h-5 w-5" />
          )}
          {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>

      <footer className="mt-10 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SheetForge. A simple tool for tabletop gamers.</p>
      </footer>
    </div>
  );
}
