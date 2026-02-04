"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PremiumSelect.module.css';

interface Option {
    id: string;
    name: string;
    description?: string;
}

interface PremiumSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label?: string;
    searchable?: boolean;
    disabled?: boolean;
    loading?: boolean;
}

export default function PremiumSelect({
    options,
    value,
    onChange,
    placeholder,
    label,
    searchable = true,
    disabled = false,
    loading = false
}: PremiumSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionId: string) => {
        onChange(optionId);
        setIsOpen(false);
        setSearchTerm('');
    };

    if (loading) {
        return (
            <div className={styles.container}>
                {label && <label className={styles.label}>{label}</label>}
                <div className={styles.skeleton}></div>
            </div>
        );
    }

    return (
        <div className={styles.container} ref={containerRef}>
            {label && <label className={styles.label}>{label}</label>}

            <div
                className={`${styles.selectTrigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className={styles.selectedText}>
                    {selectedOption ? selectedOption.name : <span className={styles.placeholder}>{placeholder}</span>}
                </div>
                <div className={styles.icons}>
                    {value && !disabled && (
                        <X
                            size={16}
                            className={styles.clearIcon}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('');
                            }}
                        />
                    )}
                    <ChevronDown size={18} className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`} />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {searchable && (
                            <div className={styles.searchContainer}>
                                <Search size={16} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className={styles.optionsList}>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(option => (
                                    <div
                                        key={option.id}
                                        className={`${styles.option} ${value === option.id ? styles.selected : ''}`}
                                        onClick={() => handleSelect(option.id)}
                                    >
                                        <div className={styles.optionContent}>
                                            <span className={styles.optionName}>{option.name}</span>
                                            {option.description && (
                                                <span className={styles.optionDesc}>{option.description}</span>
                                            )}
                                        </div>
                                        {value === option.id && <Check size={16} className={styles.checkIcon} />}
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noOptions}>No results found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
