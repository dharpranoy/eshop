const express = require('express')
const mysql = require('mysql')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const bodyparser = require('body-parser')
const upl = require('multer')()
const PDFDocument = require('pdfkit')
const cookieParser = require('cookie-parser')
const session = require('express-session')
let app = express()
app.set('views','./views')
app.set('view engine','pug')
app.use(express.json())
app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:true}))
app.use(upl.array())
app.use(express.static(path.join(__dirname+'/public')))	
app.use(session({
	secret:'Admin@fedora35',
	resave:true,
	saveUninitialized:true
}))
app.use(bodyparser.urlencoded({extended:false}))
let con = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'localmux@34',
	database:'credentials'
})
con.connect(err=>{
	if (err) throw err
})
let transporter = nodemailer.createTransport({
	service:'gmail',
	auth:{
		user:'tutor.pnd19@gmail.com',
		pass:'Easypass#23'
	}
})
app.get('/',(req,res)=>{
	if (req.cookies.userdata!=null){
		res.redirect('/home')
	}else{
		res.status=200
		res.type('text/html')
		res.sendFile(path.join(__dirname+'/login.html'))
	}
})
app.post('/sign_in',(req,res)=>{
	res.status=200
	res.type('text/plain')
	let uname = req.body.mail
	let pass = req.body.passwd
	con.query("select passwd,name from userdata where email='"+uname+"'",(err,result)=>{
		if (Object.keys(result).length === 0){
			res.redirect('/')
		}else if (result[0].passwd==pass){
			let user={
				cookiename:`${result[0].name}`,
				cookiemail:`${uname}`,
				cookiepass:`${pass}`
			}
			res.cookie("userdata",user)
			res.redirect('/home')
			
		}else{
			res.redirect('/')
		}
	})
	
})
app.get('/home',(req,res)=>{
	if (req.cookies.userdata!=null){
	res.status=200
	res.type('text/html')
	res.send(`
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>kart home</title>
		<link ref='icon' href='src/icon.ico' type='image/x-icon'>
		<script type="text/javascript">
			handle=(f_url)=>{
				fetch('/'+f_url,{
					method:'post'
				})
				.then(response=>response.json())
				.then(cons=>{
							document.getElementById('hover').innerHTML=""
							switch (f_url){
							
							case 'suggest': 
								for (const co of cons){
									let par = document.getElementById('hover')
									let cont = document.createElement('div')
									let tag = document.createElement('h3')
									tag.innerHTML=co.pname
									cont.appendChild(tag)
									let icon = document.createElement('img')
									icon.setAttribute('src',co.imgpath)
									icon.setAttribute('height','110px')
									icon.setAttribute('width','100px')
									cont.appendChild(icon)
									let chl = document.createElement('a')
									let but = document.createElement('button')
									but.innerHTML="View"
									chl.appendChild(but)
									chl.setAttribute('href','/desc?pid='+co.pcode)
									cont.appendChild(chl)
									par.appendChild(cont)
								}
								break
							case 'products':
								
								break
							case 'kart/show':
									let pak = document.getElementById('hover')
									let tak = document.createElement('p')
									tak.innerHTML="<h2>"+"Your Kart"+"</h2>"
									pak.appendChild(tak)
								for (const co of cons){
									
											let par = document.getElementById('hover')
											let tba = document.createElement('table')
											let trow = document.createElement('tr')
											let tdata = document.createElement('td')
											tdata.innerHTML="Name : "+co.prname+"<br>"+" id : "+co.prid+"<br>"
											let chl = document.createElement('a')
											chl.innerHTML="<button>"+"View"+"</button>"
											chl.setAttribute('href','/desc?pid='+co.prid)
											tdata.appendChild(chl)
											
											let rem = document.createElement('button')
											rem.setAttribute('type','button')
											rem.innerHTML="Remove item"
											rem.setAttribute
											rem.addEventListener('click',()=>{
												
											})
											
											trow.appendChild(tdata)
											tba.appendChild(trow)
											par.appendChild(tba)
										}
									
								break
							case 'order_hist': 
									let pab = document.getElementById('hover')
									let ta = document.createElement('p')
									ta.innerHTML="<h2>"+"Your Order History"+"</h2>"
									pab.appendChild(ta)
								for (const co of cons){
									let par = document.getElementById('hover')
									let tba = document.createElement('table')
									let trow = document.createElement('tr')
									let tdata = document.createElement('td')
									let chl = document.createElement('a')
									chl.innerHTML = "Name : "+co.ordername
									chl.setAttribute('href','/desc?pid='+co.orderid)
									tdata.appendChild(chl)
									let pe = document.createElement('p')
									pe.innerHTML="Shipping address : "+co.shipping+"<br>"+"Price : "+co.ocost+"/-"

									let invo=document.createElement('button')
									invo.setAttribute('type','button')
									
									invo.innerHTML='Download Invoice'
									invo.addEventListener('click',down(co.orderid))
									tdata.appendChild(pe)
									tdata.appendChild(invo)
									trow.appendChild(tdata)
									tba.appendChild(trow)
									par.appendChild(tba)
								}
								break 
							default:
								break
						}
					
				})
			}
			down=(ytp)=>{
				let obj={
					data:ytp
				}
				fetch('/invoice',{
					method:'post',
					body:JSON.stringify(obj),
					headers:{'Content-type':'application/json'}
				})
				
			}
		</script>
		<style type='text/css'>
			body{
				background-color:white;
				width:auto;
				margin:auto;
			}
			#top-strip{
				display:flex;
				justify-content:space-around;
				background-color:#472532;	
			}
			#navlinks>ul{
				list-style:none;
				display:flex;
				justify-content:space-evenly;
			}
			#navlinks>ul>li{
				padding-left:3rem;
			}
			#navlinks>ul>li>button{
				padding:1rem;
				color:white;
				border:none;
				font-size:1rem;
				background:#472532;
				border-bottom:2px solid rgb(1,1,1,0);
				transition:0.3s;
			}
			#navlinks>ul>li>button:hover{
				color:yellow;

				border-bottom:2px solid rgb(120,120,120);
				transition:0.3s;
			}
			#navlinks>ul>li>a{
				text-decoration:none;
				color:white;
				padding:0.5rem;
				
				
			}
			#logo>button{
				padding:1.3rem;
				background:black;
				color:white;
				width:20rem;
				font-size:2rem;
				border:none;
				border-radius:3rem;
				transition:0.3s;
			}
			#logo>button:hover{
				background:white;
				color:black;
				transition:0.3s;
			}
			#hover{
				display:grid;
				widht:auto;
				margin:auto;
				grid-template-columns: auto auto auto;
  				padding: 1rem;
			}
			#hover>div{
				padding:1rem;

			}
			#hover>p>h2{
				border:2px solid black;
				border-radius:1rem;
				background-color:black;
				color:white;
				font-size:1.2rem;
				width:13rem;
			}
			#hover>table>tr>td>a{
				text-decoration:none;
				font-size:1.2rem;
				color:black;
			}
			#hover>table>tr>td>a>button{
				border:none;
				border-radius:3rem;
				padding:0.5rem;
				width:6rem;
				background-color:cornflowerblue;
			}
			#hover>div>h1{
				
				color:black;
				font-size:large;
				padding:1rem;
			}
			#hover>div>a>button{
				background:cornflowerblue;
				padding:0.3rem;
				border:none;
				width:10rem;
				border-radius:3rem;
			}
			#hover>div>a{
				padding:1rem;
			}
			
		</style>
	</head>
	<body onload="handle('suggest')">
		<div class="container">
			<div id="top-strip">
				<div id="logo">
					<button type="button">Shop-ovo</button>
				</div>
				<div id="navlinks">
					<ul>
						<li><button type="button" id="suggest" onclick="handle('suggest')">Home-suggest</button></li>
						<li><button type="button" id="products" onclick="handle('products')">Products category</button></li>
						<li><button type="button" id="kart" onclick="handle('kart/show')">Your Kart</button></li>
						<li><button type="button" id="order_hist" onclick="handle('order_hist')">Orders</button></li>
						<li><a id="logout" href='/logout'><img height='50px' width='50px' src='src/refer.png'></a></li>
						<li><a id="profile" href='/profview'><img height='50px' width='50px' src='src/user.png'></a></li>
					</ul>
				</div>
			</div>
			<div id="hover">

			</div>
		</div>
	</body>
	</html>
	`)
		}else{
			res.redirect('/')
		}
	
})
app.get('/profview',(req,res)=>{
	if (req.cookies.userdata!=null){
	res.render('prof',{
		name:`${req.cookies.userdata.cookiename}`,
		rg:`${req.cookies.userdata.cookiemail}`,
		pass:`${req.cookies.userdata.cookiepass}`
	})
	}else{
		res.redirect('/')
	}
})
app.post('/update',(req,res)=>{
	if (req.cookies.userdata!=null){
		let name=req.body.uname.split(" ").join('')
		con.query('update userdata set name='+"'"+name+"',"+"passwd="+"'"+req.body.passwd+"'"+' where email='+"'"+`${req.cookies.userdata.cookiemail}`+"'",(err,result)=>{
			if (err) throw err
		})
		con.query('alter table kart_'+req.cookies.userdata.cookiename+' rename to kart_'+name,(err,est)=>{
			if (err) throw err
		})
		con.query('alter table ord_'+req.cookies.userdata.cookiename+' rename to ord_'+name,(err,est)=>{
			if (err) throw err
		})
		let user={
			cookiename:name,
			cookiemail:`${req.cookies.userdata.cookiemail}`,
			cookiepass:req.body.passwd
		}
		res.cookie("userdata",user)
		res.redirect('/home')
	}else{
		res.redirect('/')
	}
})
app.post('/invoice',(req,res)=>{
	if (req.cookies.userdata!=null){
	const doc = new PDFDocument
	doc.pipe(fs.createWriteStream('public/src/'+req.cookies.userdata.cookiemail+"_"+req.body.data+'.pdf'))
	const filepath=__dirname+'/public/src'
	con.query('select * from ord_'+req.cookies.userdata.cookiename+' where orderid='+"'"+req.body.data+"'",(err,result)=>{
		if (err) throw err
		doc.text('Shop-ovo.com',{
			height:100,
			width:100
		})
		doc.text('Thank you for shopping with us, we always try our best to deliver best products to your door')
		doc.text('Customer : '+req.cookies.userdata.cookiename)
		doc.text('Email : '+req.cookies.userdata.cookiemail)
		doc.text('Product name : '+result[0].ordername)
		doc.text('Product id : '+result[0].orderid)
		doc.text('Price : '+result[0].ocost+"/-")
		doc.text('Shipping Address : '+result[0].shipping)
		doc.text('Contact no : ')
		doc.text('Copyright : shop-ovo@2022')
		doc.end()
		res.type('application/pdf')
		res.download(filepath+'/'+req.cookies.userdata.cookiemail+"_"+req.body.data+'.pdf',(errlog)=>{
			if (errlog) throw errlog
		})
	})
	
	}else{
		res.redirect("/")
	}

})
app.post('/reset/:ret',(req,res)=>{
	let opt = req.params.ret
	switch(opt){
		case "gen":
			let pi = Math.floor(Math.random()*90000) + 10000
			let mailoptions = {
				from:'tutor.pnd19@gmail.com',
				to:'dharpranoy2255@gmail.com',
				subject:'reset password otp',
				text:`'${pi}'`
			}
			res.render('passres')
			break
		case "val":
			if (req.body.code==pi.toString()){
				
			}
			break
		default:
			break

	}
})
app.post('/suggest',(req,res)=>{
	if (req.cookies.userdata!=null){
	console.log(req.cookies)
	res.status=200
	res.type('application/json')
	con.query('SELECT pname,pcode,imgpath from productlist',(err,result)=>{
		if (err) throw err
		res.send(JSON.stringify(result))
	})
	}else{
		res.redirect('/')
	}
})
app.get('/desc',(req,res)=>{
	if (req.cookies.userdata!=null){
	res.status=200
	res.type('text/html')
	res.send(`
			<html>
			<head>
			<title>${req.query.pid}</title>
			<link ref='icon' href='icon.ico' type='image/x-icon'>
			<script type="text/javascript">
				load=()=>{
					fetch('/prod',{
						method:'post',
						headers:{'Content-Type':'application/json'},
						body:JSON.stringify({co:'${req.query.pid}'})
					})
					.then(response=>response.json())
					.then(cons=>{
						for (const c of cons){
							let par=document.getElementById('details')
							let chl=document.createElement('p')
							let icon=document.createElement('img')
							icon.setAttribute('src',c.imgpath)
							icon.setAttribute('height','400px')
							icon.setAttribute('width','400px')
							par.appendChild(icon)
							chl.innerHTML="Name : "+c.pname+"<br>"+"Price : "+c.pcost+"<br>"+"Description : "+c.description
							par.appendChild(chl)
						}
					})
					.catch(console.error)
				}
				buy=async()=>{

					let add=document.getElementById('addr')
					addr.innerHTML=""
					let inp=document.createElement('form')
					inp.setAttribute('id','send')

					let chl=document.createElement('input')
					chl.setAttribute('type','text')
					chl.setAttribute('name','addr')
					chl.setAttribute('id','dem')
					chl.setAttribute('placeholder','Enter your address here')
					inp.appendChild(chl)

					let plc=document.createElement('input')
					plc.setAttribute('type','submit')
					inp.appendChild(plc)
					
					add.appendChild(inp)
					await getf()
				}
				add=()=>{
					fetch('/prod',{
						method:'post',
						headers:{'Content-Type':'application/json'},
						body:JSON.stringify({co:'${req.query.pid}'})
					})
					.then(response=>response.json())
					.then(cons=>{
						let bod={
							co:'${req.query.pid}',
							ord:cons[0].pname,
							imgp:cons[0].imgpath
						}
						fetch('/kart/addk',{
							method:'post',
							headers:{'Content-Type':'application/json'},
							body:JSON.stringify(bod)
						})
						.then(resv=>resv.text())
						.then(kr=>{
							alert(kr)
						})
					})
				}
				getf=()=>{
					document.getElementById('send').onsubmit=()=>{
						let bod={
							co:'${req.query.pid}',
							loc:document.getElementById('dem').value
						}
						
						fetch('/buyitem',{
							method:'post',
							headers:{'Content-Type':'application/json'},
							body:JSON.stringify(bod)
						})
						.then(response=>response.text())
						.then(cons=>{
							alert(cons)
						})
					}	
				}
			</script>
			<style type='text/css'>
			body{
				padding:5rem;
				background-color:#472532;
			}
				#details {
					font-size:large;
					
					color:white;
				}
				#buy>button{
					padding:1rem;
					margin:1.4rem;
					background-color:#003623;
					border:none;
				}
			</style>
			<body onload="load()">
				<div id="details">
					<h1>Product Item</h2>
				</div>
				<div id="buy">
					<button type="button" onclick="buy()">Buy this item</a></button>
					<button type="button" onclick="add()">Add to kart</button>
				</div>
				<div id="addr">
					
				</div>
			</body>
			</html>

	`)
	}else{
		res.redirect('/')
	}
})
app.post('/kart/:opr',(req,res)=>{
	if (req.cookies.userdata!=null){
		console.log(req.params.opr)
		switch(req.params.opr){
			case 'show':
				res.type('application/json')
				con.query('select prname,prid from kart_'+req.cookies.userdata.cookiename,(err,result)=>{
					if (err) throw err
					res.send(JSON.stringify(result))
				})
				break
			case 'addk':
				res.type('text/plain')
				con.query('insert into kart_'+req.cookies.userdata.cookiename+' values ('+"'"+req.body.ord+"'"+","+"'"+req.body.co+"'"+')',(err,result)=>{
					if (err) throw err
					res.send('added to kart')
				})
				break
			case 'rem':
				break
			default:
				break

		}

	}else{
		res.redirect('/')
	}
})
app.post('/buyitem',(req,res)=>{
	if (req.cookies.userdata!=null){
		let code=req.body
		con.query('SELECT pname,pcost from productlist where pcode='+"'"+code.co+"'",(err,result)=>{
			if (err) throw err
			con.query('INSERT into ord_'+req.cookies.userdata.cookiename+'(ordername,'+'orderid,'+'shipping,'+'ocost)'+'values ('+"'"+result[0].pname+"'"+','+"'"+code.co+"'"+','+"'"+code.loc+"'"+','+result[0].pcost+')',(err,outp)=>{
				if (err) throw err
				res.type('text/plain')
				res.send('order placed')
			})
		})
	}else{
		res.redirect('/')
	}
})
app.post('/prod',(req,res)=>{
	if (req.cookies.userdata!=null){
	let code=req.body
	con.query('SELECT * FROM productlist where pcode="'+code.co+'"',(err,result)=>{
		if (err) throw err
		res.send(JSON.stringify(result))
	})
	}else{
		res.redirect('/')
	}
	
})
app.post('/order_hist',(req,res)=>{
	
	if (req.cookies.userdata!=null){
		res.type('applicaton/json')
		con.query('SELECT * from ord_'+req.cookies.userdata.cookiename,(err,result)=>{
			if (err) throw err
			res.send(JSON.stringify(result))
		})
	}else{
		res.redirect('/')
	}
}) 
app.get('/logout',(req,res)=>{
	res.clearCookie('userdata')
	res.redirect("/")
	
})
app.post('/sign_up',(req,res)=>{
	res.status=200
	let uname = req.body.uname.split(' ').join('')
	let mail = req.body.mail
	let pass = req.body.passwd
	let que = 'insert into userdata (name,email,passwd) values ('+"'"+uname+"'"+","+"'"+mail+"'"+","+"'"+pass+"'"+")"
	con.query(que,(err,result)=>{
		if (err) res.redirect('/')	
	})
	let add = 'create table ord_'+uname+' ('+'id mediumint not null AUTO_INCREMENT,'+'ordername varchar(120) not null,'+'orderid varchar(10) not null,'+'shipping varchar(120) not null,'+'ocost int not null,'+'PRIMARY KEY (id))'
	con.query(add,(err,result)=>{
		if (err)
			console.log('error creating table')
		else
			console.log('created')
	})
	let ek = 'create table kart_'+uname+'('+'prname varchar(120) not null,'+'prid varchar(10) not null'+')'
	con.query(ek,(err,result)=>{
		if (err) 
			console.log('error creating kart')
		else
			console.log('created kart')
	})
	let user = { 
				cookiename:`${uname}`,
				cookiemail:`${mail}`,
				cookiepass:`${pass}`
		}
	res.cookie("userdata",user)
	res.render('welcome',{
		name:`${uname}`,
		url:"/home"
	})

})
app.listen(3300)
