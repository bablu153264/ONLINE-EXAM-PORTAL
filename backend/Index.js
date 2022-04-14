let express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const
{auth,signInWithEmailAndPassword,createUserWithEmailAndPassword}=require("./co
nfig/firebase-config");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static( "public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
const adminRouterCourse = require("./routes/admin/course");
const adminRouterTests = require("./routes/admin/test");
const courseRouter = require("./routes/courses/course");
const studentRouter = require("./routes/student/course");
const adminRouterQuestions = require("./routes/admin/questions");
const studentRouterAnswers = require("./routes/student/answers");
const questionRoute = require("./routes/questions/question");
app.use("/admin/course", adminRouterCourse);
app.use("/admin/test", adminRouterTests);
app.use("/course", courseRouter);
app.use("/student/course", studentRouter);
app.use("/student/answers", studentRouterAnswers);
app.use("/test", testRouter);
app.use("/admin/question", adminRouterQuestions);
app.use("/question", questionRoute);
app.get("/", (req, res) => { res.render('index'); });
app.get("/login",(req,res)=>{ res.render('login',{message:null}); });
app.post("/login",(req,res)=>{
const{email,password}=req.body;
console.log(email+" "+password);
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
res.cookie("uid",userCredential.user.uid);
}).catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
res.render("login",{message:errorMessage}); });
});
app.get("/register",(req,res)=>{ res.render('register',{message:null});
});
app.post('/register',(req,res)=>{
const{email,password}=req.body;
7
createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
res.cookie("uid",userCredential.user.uid);
res.render('course');
}).catch((error) => {
res.render("register",{message:"User exists"});}); });
app.get('/course',(req,res)=>{ res.render('course'); });
app.listen(3001, function () {
console.log("Listening on port 3001");
});