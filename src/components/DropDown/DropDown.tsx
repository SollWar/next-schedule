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
  disabled?: boolean
}

const DropDown = ({
  options,
  children,
  className,
  style,
  onSelected,
  disabled,
  index,
}: DropDownProps) => {
  const [visivle] = useState(false)
  return (
    <DropdownMenu.Root>
      {/* Кнопка для открытия меню */}
      <DropdownMenu.Trigger
        disabled={disabled ?? false}
        className={`${className} ${
          visivle ? styles.dropdownContent_Enable : ''
        }`}
        style={style}
      >
        {children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.dropdownContent} align="start">
          {options.map((option) => (
            <DropdownMenu.Item
              key={option}
              className={
                option == 'users' || option == 'jobs'
                  ? styles.separator
                  : styles.dropdownItem
              }
              onSelect={() =>
                option == 'users' || option == 'jobs'
                  ? null
                  : onSelected(option, index)
              }
            >
              {option == 'users' ? (
                <div>Сотрудники</div>
              ) : option == 'jobs' ? (
                <div>Магазины</div>
              ) : (
                option
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default DropDown
