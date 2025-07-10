import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    required: true 
  },
  coverimage: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  refreshToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  watchhistory: [{
    type: Schema.Types.ObjectId,
    ref: "Video"
  }],
  videos: [{
    type: Schema.Types.ObjectId,
    ref: "Video"
  }]
}, {
  timestamps: true
});

userSchema.pre("save",async function(next){                                      
                                                                       
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);                         
    }
    next();
})

userSchema.methods.isPasswordmatch= async function(password){
    return await bcrypt.compare(password,this.password); 
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id, username: this.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id, username: this.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d' }
    );
};

export const User = mongoose.model("User", userSchema);






// bcrypt->it is a library for hashing passwords and Compare hashes when a user logs in.
// we normally use word hash which means that we are converting a password into a string of characters that is not readable by humans.


// jwt->it is a library for creating and verifying JSON Web Tokens, which are used for user authentication in web applications.
// Used for stateless authentication


// tokens->is issued to a user after they successfully log in. It is used to identify the user in future requests without 
// needing to log in again.

// access token->is a short-lived token that is used to access protected resources. It is usually valid for a few minutes to an hour.it an be easily sent in headers without much risk


// refresh token->is a long-lived token that is used to obtain a new access token when the current one expires. 
// It is usually valid for days or weeks.it Stored securely (often in HTTP-only cookies).



// working of tokens given below:

//  1) User logs in → Server issues access token and refresh token.

//  2) Frontend stores access token in memory (or cookie).

//  3) User makes requests → access token is used.

//  4) After 1 day → access token expires.

//  5) Frontend uses refresh token to request a new access token.

//  6) Server validates the refresh token and returns a new access token.
























