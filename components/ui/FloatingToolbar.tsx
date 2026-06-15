import Image from "next/image";
import Link from "next/link";
import "../../app/css/floating-toolbar.css";

export default function FloatingToolbar() {
  return (
    <div className="floating-toolbar">
      <div className="flex items-center gap-3">
        {/* Profile Image Icon */}
        <Link href="/profile" aria-label="Profile">
          <Image
            src="/globe.svg"
            alt="Profile avatar"
            width={28}
            height={28}
            className="floating-toolbar__profile-link object-cover"
          />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* Register Button */}
        <Link href="/register" className="floating-toolbar__register-btn">
          Register
        </Link>

        {/* Login Button */}
        <Link href="/login" className="floating-toolbar__login-btn">
          Login
        </Link>
      </div>
    </div>
  );
}
