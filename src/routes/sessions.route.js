import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import { createHash, validatePassword } from '../utils.js';
import passport from 'passport';

const router = Router();

// router.post("/register", async (req,res)=>{
//     const { first_name, last_name, email, age, password } = req.body;
 
//     const exists = await userModel.findOne({email});
 
//     if(exists){
//      return res.status(400)
//      .send({
//          status:"error",
//          error:"El usuario ya existe"
//      })
//     }
    
//     const user = {
//          first_name,
//          last_name,
//          email,
//          age,
//          password: createHash(password)
//      }

 
//      let result = await userModel.create(user);
//      res.send({
//          status:"success",
//          message:"Usuario registrado"
//      })
//  })

router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}),
async (req,res)=> {
    res.send({
        status: 'success', 
        message: 'User created successfully'
    })
})

router.get('/failregister', async (req,res)=> {
    console.log('Registration has failed');
    res.send({error:  "Registration failed!"})

})
//  router.post("/login", async (req,res)=>{
//      const {email, password} = req.body;

//      console.log(`Intento de inicio de sesión para el usuario: ${email}`);

//      const user = await userModel.findOne({email}); //saqué password
   
//      if(!user){
//         return res.status(400).send({
//              status:"error",
//              error:"Datos incorrectos"
//          })
//      }
    
//      let role = 'user';
     
//      if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
//         role = 'admin';
//     }

//     const isvalidPassword = validatePassword(password, user);
//     if(!isvalidPassword){
//         return res.status(400).send({
//             status: 'error',
//             error: 'Datos incorrectos'
//         })
//     }
    
//      req.session.user = {
//         full_name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         age: user.age,
//         role: role
//     };

//     console.log(`Inicio de sesión exitoso para el usuario: ${email}`);

    

//     res.send({
//         status:"success",
//         payload: req.session.user,
//         message:"Mi primer Login!!"
//     })
//  })

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/api/sessions/faillogin'}),
async(req,res)=> {
    if(!req.user){
        return res.status(400).send({status:'error'})
    }
    req.session.user ={
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email:req.user.email
    }
    res.send({status: 'success', payload: req.user})
})

router.get('/faillogin', (req,res)=> {
    res.send({error: 'fail login'})
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}),
async (req,res)=> {});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),
async (req,res)=> {
    req.session.user = req.user
    res.redirect('/')
});

 router.get('/logout', async (req,res)=> {
    req.session.destroy( err => {
        if(err){
            res.status(500).send({
                status:'error',
                msg: 'Logout error', 
                error: err
            })
            
        }
        res.redirect('/login');
    
    })

 })

 router.post('/restartPassword', async (req,res)=> { //reseteo el password
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send(
        res.send({
            status: 'error',
            message: 'Datos incorrectos'
        })
    )

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).send({
             status:"error",
             error:"Datos incorrectos"
         })
     }

     const newHashPassword = createHash(password); 
     // ahora debo actualizar el usuario pero sólo el password

     await userModel.updateOne({_id:user._id}, {$set:{password:newHashPassword}});
     res.send({
        status: 'success',
        message: 'Contraseña restaurada'
     })
})

 
 export default router;