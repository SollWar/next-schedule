export default function Loading() {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
    </div>
  )
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #ccc',
    borderTopColor: '#0070f3',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
}
