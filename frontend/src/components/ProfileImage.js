import { useState, useEffect, React } from "react"
import { GET_USER_BY_ID } from "../GraphQL/Queries"
import { ContextHeader } from "../constants"
import { useQuery } from "@apollo/client"
import axios from "axios"
import { Button, Image } from "react-bootstrap"

export default function ProfileImage() {
  const [file, setFile] = useState()
  const [fileLink, setFileLink] = useState()


  const imageMaxSize = 1000000 // 1000000=1Mb
  const admitedImageFormats = ["png", "jpg", "jpeg"]

  function fileSelectedHandler(e) {
    let imageType = e.target.files[0].type
    imageType = imageType.toLowerCase().slice(6, 10) //type was
    const imageSize = e.target.files[0].size
    const target = e.target.files[0]
    console.log("type", imageType, "original: ", target.type)
    console.log("size", imageSize)
    console.log("target", target)

    if (imageSize >= imageMaxSize) {
      alert("Max image size is 1Mb")
    }

    function formatValid() {
      return admitedImageFormats.some(
        (admitedImageFormats) => imageType === admitedImageFormats
      )
    }
    setFile(target)
    alert(formatValid())
  }

  function fileUploadHandler() {
    console.log("uploading pic...", file.name)
    var fd = new FormData()
    fd.append("avatar", file, file.name)
    axios
      .post(
        'http://localhost:5000/api/avatar',
        {
          headers: {
            "x-auth-token": localStorage.getItem("SECREToken"),
          },
        },
        fd
      )
      .then((res) => {
        console.log(res)
      })
  }
  useEffect(() => {}, [])

  return (
    <div className="ProfileImage">
      <Image src="https://img.icons8.com/clouds/2x/name.png" rounded />

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
