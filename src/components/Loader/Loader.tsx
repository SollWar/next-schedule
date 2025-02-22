// components/Loader.tsx
import React from 'react'

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

interface LoaderProps {
  isLoading: boolean
  children: React.ReactNode
  text?: string
}

const Loader = ({ isLoading, children, text = 'Загрузка...' }: LoaderProps) => {
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>{text}</p>
      </div>
    )
  }

  return <>{children}</>
}

export default Loader
