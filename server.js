const express = require( 'express' ),
    cookie  = require( 'cookie-session' ),
    app = express()

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/login', (req,res)=> {
    // express.urlencoded will put your key value pairs 
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered
    console.log( req.body )
    
    // below is *just a simple authentication example* 
    // for A3, you should check username / password combos in your database
    if( req.body.password === 'test' ) {
      // define a variable that we can check in other middleware
      // the session object is added to our requests by the cookie-session middleware
      req.session.login = true
      
      // since login was successful, send the user to the main content
      // use redirect to avoid authentication problems when refreshing
      // the page or using the back button, for details see:
      // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
      res.redirect( 'main' )
    }else{
      // password incorrect, redirect back to login page
      res.sendFile( __dirname + '/views/index.html' )
    }
  })
  
// add some middleware that always sends unauthenicated users to the login page

app.get( '/main', ( req, res) => {
    if( req.session.login === true )
        res.sendFile( __dirname + '/views/main.html' )
    else{
        res.sendFile( __dirname + '/views/index.html' )
    }
})

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) ) 

app.listen( process.env.PORT || 3000 )