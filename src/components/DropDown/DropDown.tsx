'use client'

import React, { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import styles from './DropDown.module.css'

interface DropDownProps {
  options: string[]
  onSelected: (selected: string, index: number) => void
  className: string
  key: React.Key
  index: number
  style: React.CSSProperties
  children: React.ReactNode
}

const DropDown = ({
  options,
  children,
  className,
  style,
  onSelected,
  index,
}: DropDownProps) => {
  const [visivle] = useState(false)
  return (
    <DropdownMenu.Root>
      {/* Кнопка для открытия меню */}
      <DropdownMenu.Trigger
        className={`${className} ${
          visivle ? styles.dropdownContent_Enable : ''
        }`}
        style={style}
      >
        {children}
      </DropdownMenu.Trigger>

      {/* Выпадающее меню */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.dropdownContent} align="start">
          {options.map((option) => (
            <DropdownMenu.Item
              key={option}
              className={styles.dropdownItem}
              onSelect={() => onSelected(option, index)}
            >
              {option}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default DropDown
