import express from "express";
const router=express.Router();
import { database } from "../../config/firebase-config";
import { set, ref,get,push,child } from "firebase/database";
import { Request, Response, NextFunction } from "express";
import { verifyBody,verifyParams } from "../middleware/userVerification";
import { course ,test} from "structures/structures";
router.get("/details/:id",async (req:Request,res:Response):Promise<void>=>{
const courseId=req.params.id;
try{ const adminReference = ref(database,`courses/${courseId}/tests`);
const testIds = ((await get(child(adminReference, "/")))).val();
const tests:test[] = await Promise.all(Object.keys(testIds).map(async
(element:string):Promise<any>=>{
const testRef = ref(database,`tests/${element}`);
const courseObj:test = ((await get(child(testRef, "/")))).val();
return {...courseObj,testId:element}; }))
res.render('coursedetails',{courseId:courseId,tests:tests});}catch(e)
{ res.send("Error");}});
interface courseWithId extends course{ courseId:string,}
router.get("/",async (req:Request, res:Response):Promise<void> => {
let rc=req.headers.cookie;
let list:any=[];
rc && rc.split(';').forEach(function( cookie ) {
var parts:any = cookie.split('=');
list[parts.shift().trim()] = decodeURI(parts.join('='));
});
const userId=list['uid'];
const adminReference = ref(database,`student/${userId}/courses`);
const courseIds = ((await get(child(adminReference, "/")))).val();
if(!courseIds){
res.set(200);
res.json({
message:"You have not created any courses",
courses:[]}) }
if(typeof courseIds==="object"){
8
const courses:courseWithId[] = await
Promise.all(Object.keys(courseIds).map(async
(element:string):Promise<courseWithId>=>{
const courseRef = ref(database,`courses/${element}`);
const courseObj:course = ((await get(child(courseRef, "/")))).val();
return {...courseObj,courseId:element};
}))
res.render('course',{user:'student',courses:courses});
}else{
res.sendStatus(500);
res.json({
message:"Something went seriously wrong",
courses:[] }) }
});
module.exports = router;