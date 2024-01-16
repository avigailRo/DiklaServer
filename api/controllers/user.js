const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Order = require('../models/order')
const mongoose = require('mongoose')

module.exports = {

    getAll: (req, res) => {
        User.find().populate({ path: 'petipurs', select: 'title description content' })
            .then((users) => { res.status(200).send({ users }) })
            .catch((error) => { res.status(404).send({ message: error.message }) })
    },

    register: async (req, res) => {
        console.log("dd");
        console.log(req.body);
        const { email, password, username, userName } = req.body;
        
        // בדיקה אם יש משתמש קיים עם האימייל
        User.find({ email: { $eq: email } })
            .then(users => {
                if (users.length > 0) {
                    return res.status(409).send({ message: 'Email is already exists' });
                }
        
                //bcrypt.hash - יוצרת מחרוזת שמצפינה את האובייקט שנשלח אליה
                //נשתמש בה ע"מ ליצור מחרוזת מוצפנת לסיסמה ואותה נשמור במסד
                //הפונקציה מקבלת שלשה ארגומנטים
                //1. האובייקט עליו נפעיל את ההצפנה
                //2. מספר או מחרוזת כלשהי שלפיה הפונקציה תגריל את המחרוזת
                //3. פונקציית callback
                bcrypt.hash(password, 10, (error, hash) => {
                    if (error) {
                        return res.status(500).send({ error: error.message });
                    }
        
                    const user = new User({
                        email,
                        password: hash,
                        username,
                        userName
                    });
        
                    console.log(user, "dff");
        
                    user.save()
                        .then(savedUser => {
                            const token = jwt.sign({ email, password }, process.env.SECRET, {});
        
                            const userId = savedUser._id;
                            const validuserId = mongoose.Types.ObjectId(savedUser._id);
        
                            console.log(validuserId);
        
                            const order = new Order({
                                user: validuserId,
                                orderItem: [],
                                date: new Date(),
                                isPayment: false
                            });
        
                            order.save()
                                .then(savedOrder => {
                                    User.findByIdAndUpdate(
                                        { _id: validuserId },
                                        { $push: { orders: savedOrder._id } },
                                        { new: true }
                                    )
                                        .then(() => {
                                            return res.status(200).send({ userId: validuserId, user: savedUser, token });
                                        })
                                        .catch(orderError => {
                                            res.status(500).send({ error: orderError.message });
                                        });
                                })
                                .catch(orderError => {
                                    res.status(500).send({ error: orderError.message });
                                });
                        })
                        .catch(userError => {
                            res.status(500).send({ error: userError.message });
                        });
                });
            })
            .catch(findError => {
                console.log(findError);
                return res.status(500).send({ error: findError.message });
            });
    },
    login: async (req, res) => {
        const email = req.params.email;
        const password = req.params.password;
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
                    res.status(200).send({ userId: user._id, user: user, token })
                })
            })
            .catch(error => {
                res.status(404).send({ error: error.message })
            })
    },


}