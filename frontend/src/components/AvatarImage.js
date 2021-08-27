import { React } from "react"
import { Image } from "react-bootstrap"

export default function AvatarImage({ avatarUrl, name, size }) {
  const setSize = {
    height: `${size}px`,
    width: `${size}px`,
  }

  return (
    <>
      {avatarUrl ? (
        <Image src={avatarUrl} alt="img" style={setSize} className="dot" />
      ) : (
        <div className="dot" style={setSize}>
          <div className="center-me dot">{name?.slice(0, 2)}</div>
        </div>
      )}
    </>
  )
}
