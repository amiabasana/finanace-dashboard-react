
const Footer = () => {
    const date = new Date().getFullYear();
  return (
     <footer className="border-t border-fd-border px-4 py-4 text-xs text-fd-text-muted bg-fd-bg-solid/90 sm:px-6">
          <div className="mx-auto max-w-full text-center">
            <p className='md:text-base text-sm'>© {date}  — Fido FinTech Pvt. Ltd. All rights reserved.</p>
          </div>
        </footer>
  )
}

export default Footer