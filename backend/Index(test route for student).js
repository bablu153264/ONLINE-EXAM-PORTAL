import express from "express";
const router = express.Router();
import { Request, Response} from 'express';
import {set,ref,get,child,push} from "firebase/database"
import { test,question} from "structures/structures";
import multer from "multer";
const upload = multer();
import { v4 as uuid } from "uuid";
import { uploadBytes,getDownloadURL } from "@firebase/storage";
import {database,ref1,storage } from "../../config/firebase-config";
router.get("/:id",async (req:Request, res:Response):Promise<void>=> {
const testId=req.params.id;
const d=new Date();
try{
const testReference=ref(database,`tests/${testId}`);
const testP:any=(await get(child(testReference,"/"))).val();
const questionIds:any=testP.questions;
const questions:question[]=await
Promise.all(Object.keys(questionIds).map(async
(element:string):Promise<question>=>{
const questionRef = ref(database,`questions/${element}`);
const questionObj:question = ((await get(child(questionRef,
"/")))).val();
return {...questionObj,questionId:element};
}));
res.render('test',{testId:testId,endTime:testP.endTime,questions:que
stions});
}catch(error)
{
console.log(error);
res.send("Error");
9
}
});
router.post("/:id",upload.any(), async
(req:Request,res:Response):Promise<void>=>{
const testId=req.params.id;
const answerId = uuid();
let rc=req.headers.cookie;
let list:any=[];
rc && rc.split(';').forEach(function( cookie ) {
var parts:any = cookie.split('=');
list[parts.shift().trim()] = decodeURI(parts.join('='));
});
let studentId=list['uid'];
var files = req.files as Express.Multer.File[];
let size = files?.length;
const metadata = {
contentType: "application/pdf",
};
try{
let downloadURLs: string[] = [];
if (size != null && files != null) {
for (let i = 0; i < size; i++) {
const fileName = `${i}.pdf`;
const storageRef = ref1(storage, answerId + "/" + fileName);
const file = files[i];
await uploadBytes(storageRef, file.buffer, metadata);
const downloadURL = await getDownloadURL(storageRef);
downloadURLs[i] = downloadURL;
}
}
await set(ref(database, `answers/${answerId}`), {
studentId: studentId,
questionId: questionId,
uploads: downloadURLs,
});
res.redirect('/student/course')
}catch(error){
console.log(error);
}
});
module.exports = router;