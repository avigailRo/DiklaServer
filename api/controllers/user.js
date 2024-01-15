const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    getAll: (req, res) => {
        User.find().populate({ path: 'petipurs', select: 'title description content' })
            .then((users) => { res.status(200).send({ users }) })
            .catch((error) => { res.status(404).send({ message: error.message }) })
    },

    register:async (req, res) => {
        console.log("dd");
        console.log(req.body);
        const { email, password ,username,userName} = req.body
        console.log(email, password ,username);
        User.find({ email: { $eq: email } })
            .then(users => {
                if (users.length > 0) {
                    return res.status(409).send({ message: 'Email is already exists' })
                }
                console.log("dd");
                //bcrypt.hash - יוצרת מחרוזת שמצפינה את האובייקט שנשלח אליה
                //נשתמש בה ע"מ ליצור מחרוזת מוצפנת לסיסמה ואותה נשמור במסד
                //הפונקציה מקבלת שלשה ארגומנטים
                //1. האובייקט עליו נפעיל את ההצפנה
                //2. מספר או מחרוזת כלשהי שלפיה הפונקציה תגריל את המחרוזת
                //3. פונקציית callback
                bcrypt.hash(password, 10, (error, hash) => {
                    if (error) {
                        return res.status(500).send({ error: error.message })
                    }
                    const user = new User({
                        email,
                        password: hash,
                        username,
                        userName
                    })
                    console.log(user,"dff");
                      user.save().catch(error => {
                        console.log(error);
                        return res.status(404).send({ error: error.message })
                    })
                })
            })
            .then((user) => {
                return res.status(200).send({ user })
            })
            .catch(error => {
                console.log(error);
                return res.status(404).send({ error: error.message })
            })
            .catch(error => {
                console.log(error);
                return res.status(500).send({ error: error.message })
            })
    },
    login:async (req, res) => {
const email=req.params.email;
const password=req.params.password;
        User.find({ email: { $eq: email } })
            .then(users => {
                if (users.length == 0) {
                    return res.status(409).send({ message: 'Email and password are not matches!' })
                }

                // const user = users[0]
                const [user] = users

                //bcrypt.compare - יוצרת מחרוזת שמצפינה את האובייקט שנשלח אליה
                //נשתמש בה ע"מ לוודא שהסיסמה שהוזנה אכן שייכת למשתמש שנכנס
                //הפונקציה מקבלת שלשה ארגומנטים
                //1. req.body האובייקט עליו הפעלנו את ההצפנה - מתוך ה
                //2. שאותו רוצים להשוות hash
                //3. פונקציית callback
                bcrypt.compare(password, user.password, (error, result) => {
                    if (error || !result) {
                        return res.status(500).send({ error: 'Email and password are not matches!' })
                    }

                    //jwt.sign = יצירת צופן
                    //מקבל שלשה ארגומנטים
                    //1. אובייקט שלפיו נערוך את ההצפנה
                    //2. מזהה יחודי של המערכת שישלח בכל הצפנה ובכל פענוח
                    //3. אובייקט אפשרויות - לא חובה
                    //אנחנו הגדרנו שהצופן יהיה תקף לשעה אחת בלבד
                    const token = jwt.sign({ email, password }, process.env.SECRET, {
                        // expiresIn: '1H'
                    })

                    //שליחת הצופן לצד שרת בכניסה למערכת
                    res.status(200).send({ userId:user._id,user: user, token })
                })
            })
            .catch(error => {
                res.status(404).send({ error: error.message })
            })
    },

    
}