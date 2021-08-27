import { React } from "react"
import { Image } from "react-bootstrap"

export default function AvatarImage({ avatarUrl, name }) {
  return (
    <>
      {avatarUrl ? (
        <Image src={avatarUrl} alt="" className="dot-mini" 
        />
      ) : (
        <div className="dot-mini">
          <div className="center-me">{name?.slice(0, 2)}</div>
        </div>
      )}
    </>
  )
}
