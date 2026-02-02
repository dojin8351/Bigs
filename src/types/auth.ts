export type signUpReq = {
  username : string
  name : string
  password : string
  confirmPassword : string
}

export type loginReq = {
  username : string
  password : string
}

export type signUpRes = {
  accessToken : string
  refreshToken : string
}

export type refreshReq = {
  refreshToken : string
}

export type refreshRes = signUpRes