import { useState, useEffect, React } from "react"
import { GET_USER_BY_ID } from "../GraphQL/Queries"
import { ContextHeader } from "../constants"
import { useQuery } from "@apollo/client"
import axios from "axios"
import { Button, Image, Card } from "react-bootstrap"
import { TOKEN } from "../constants"

export default function ProfileImage(props) {
  const [file, setFile] = useState()
  
  const imageMaxSize = 1_000_000 // 1Mb
  const admittedImageFormats = ["png", "jpg", "jpeg"]
  const urlAvatar = "http://localhost:5000/api/avatar"

  function fileSelectedHandler(e) {
    let imageType = e.target.files[0].type
    imageType = imageType.toLowerCase().slice(6) //from image/png make png jpeg
    const imageSize = e.target.files[0].size
    const target = e.target.files[0]
    console.log("type", imageType, "original: ", target.type)
    console.log("size", imageSize)
    console.log("target", target)

    if (imageSize >= imageMaxSize) {
      alert("Max image size is 1Mb")
    }

    function formatValid() {
      return admittedImageFormats.some(
        (admittedImageFormats) => imageType === admittedImageFormats
      )
    }
    setFile(target)
    console.log(formatValid())
  }

  function fileUploadHandler() {
    console.log("uploading pic...", file.name)
    const fd = new FormData()
    fd.append("avatar", file)

    axios
      .post(urlAvatar, fd, {
        headers: {
          "x-auth-token": TOKEN,
        },
      })
      .then((res) => {
        console.log(res.data.location)
        props.setState((state) => ({ ...state, avatar: res.data.location }))
      })
  }

  return (
    <div className="ProfileImage"class="center">
      <Image
        src={props?.state?.avatar}
        width="300"
        height="300"
        alt="That's me"
        roundedCircle
        
      />
      <br />

      <br />

      <input type="file" onChange={fileSelectedHandler} />
      <br />
      <br />

      <Button variant="primary" size="sm" onClick={fileUploadHandler}>
        Upload foto
      </Button>
    </div>
  )
}
