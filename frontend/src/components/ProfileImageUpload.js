import { useState, React, useContext } from "react"
import axios from "axios"
import { Button, Image } from "react-bootstrap"
import { TOKEN } from "../constants"
import { AuthContext } from "../App"

export default function ProfileImage() {
  const [file, setFile] = useState()
  const [errored, setErrored] = useState("")
  const { token, state, setState } = useContext(AuthContext)

  const imageMaxSize = 1_000_000 // 1Mb
  const admittedImageFormats = ["png", "jpg", "jpeg"]

  const urlAvatar = process.env.REACT_APP_HOST.slice(0, -8) + `/api/avatar`
  //Using REACT_APP_HOST and removing the section `/graphql`
  //console.log("URLAvatar", process.env.REACT_APP_HOST.slice(0, -8))

  function fileSelectedHandler(e) {
    let imageType = e.target.files[0].type
    imageType = imageType.toLowerCase().slice(6) //from image/png make png jpeg
    const imageSize = e.target.files[0].size
    const target = e.target.files[0]
    console.log("type", imageType, "original: ", target.type)
    console.log("size", imageSize)
    console.log("target", target)

    function formatValid() {
      return admittedImageFormats.some(
        (admittedImageFormats) => imageType === admittedImageFormats
      )
    }

    if (!formatValid()) {
      setErrored(`File have to be "jpg", "jpeg", "png" `)
      disableBtn()
    } else if (imageSize >= imageMaxSize) {
      setErrored("Img too big")
      disableBtn()
    } else {
      enableBtn()
      setErrored(true)
      setFile(target)
      console.log(formatValid())
    }
  }

  function disableBtn() {
    const uploadBtn = document.getElementById("buttonUpload")

    uploadBtn.disabled = true
    uploadBtn.style.background = "#000000"
  }

  function enableBtn() {
    const uploadBtn = document.getElementById("buttonUpload")

    uploadBtn.disabled = false
    uploadBtn.style.background = "#007bff"
  }

  function fileUploadHandler() {
    errored
      ? //console.log("There is a error", errored)
        disableBtn()
      : console.log("uploading pic...", file.name)
    const fd = new FormData()
    fd.append("avatar", file)

    axios
      .post(urlAvatar, fd, {
        headers: {
          "x-auth-token": TOKEN,
        },
      })
      /*.catch(() => {
        setErrored(true)
      })*/
      .then((res) => {
        //  if(!errored){
        console.log(res?.data?.location)
        setState((state) => ({ ...state, avatar: res?.data?.location }))
        //}
      })
  }

  return (
    <div className="ProfileImage center">
      <Image
        src={state?.avatar}
        width="300"
        height="300"
        alt="That's me"
        roundedCircle
      />
      <br />
      {errored && (
        <small id="loginHelpBlock" className="form-text text-muted">
          {errored}
        </small>
      )}

      <br />

      <input type="file" onChange={fileSelectedHandler} />
      <br />
      <br />

      <Button
        id="buttonUpload"
        name="buttonUpload"
        variant="primary"
        size="sm"
        onClick={fileUploadHandler}
      >
        Change foto
      </Button>
    </div>
  )
}
