import logoImage from '../images/channels4_profile.jpg'

const V4Logo = ({ className = "w-32 h-32", showText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoImage}
        alt="V4 Company Logo"
        className="w-full h-full object-contain"
      />
      
      {showText && (
        <span className="text-2xl font-bold text-v4-primary">V4 Company</span>
      )}
    </div>
  )
}

export default V4Logo

