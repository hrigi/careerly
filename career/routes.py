from flask import Flask, render_template, request, redirect,  flash, abort, url_for
from flask_login import login_user, current_user, logout_user, login_required
from random import randint
import os
from tkinter.ttk import * 
import numpy as np
from sqlalchemy import or_
import pickle
import numpy as np
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager,login_user
from career.models import *
from career import app,mail
from flask_mail import Message
import secrets





@app.route('/hometest',methods=['GET','POST'])
def hometest():
    return render_template("hometest.html")



@app.route('/reset',methods=['GET','POST'])
def reset():
    c= Register.query.filter_by(id=current_user.id).first()
    if request.method == 'POST':
        c.password =  request.form['newpass']
     
        db.session.commit()
        return redirect('/reset')
    else:
        return render_template('reset.html',c=c)




@app.route('/blog',methods=['GET','POST'])
def blog():
    return render_template("blog.html")


@app.route('/register',methods=['GET','POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        contact = request.form['phn']
        a=len(contact)
        print(a)
        if a!=10:
            b="Invalid Contact try again!!!!!!!!!!!!!"
            print("invald")
            return render_template("register.html",b=b)
        address = request.form['address']
        password = request.form['password']
        my_data = Register(name=name,email=email,contact=contact,address=address,password=password)
        db.session.add(my_data)
        db.session.commit()
        return redirect('/register')
    return render_template("register.html")





@app.route('/',methods=['GET','POST'])
def login():
    if request.method=="POST":
        email=request.form['email']
        password=request.form['password']
        user =Register.query.filter_by(email=email, password=password).first()
        if user:
            login_user(user)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect('/hometest') 
        else:
            return render_template("login.html")
    return render_template("login.html")







@app.route('/predict',methods = ['POST', 'GET'])
def result():
   if request.method == 'POST':
      result = request.form
      i = 0
      print(result)
      res = result.to_dict(flat=True)
      print("res:",res)
      arr1 = res.values()
      arr = ([int(value) for value in arr1])
      print(arr)
      arr.pop()
      print(arr)
      data = np.array(arr)
      print(data)
    #   data = data.pop()
      data = data.reshape(1,-1)
      print(data)
      loaded_model = pickle.load(open("career/careerlast.pkl", 'rb'))
      predictions = loaded_model.predict(data)
     # return render_template('testafter.html',a=predictions)
      
      print(predictions)
      pred = loaded_model.predict_proba(data)
      print(pred)
      #acc=accuracy_score(pred,)
      pred = pred > 0.05
      #print(predictions)
      i = 0
      j = 0
      index = 0
      res = {}
      final_res = {}
      while j < 17:
          if pred[i, j]:
              res[index] = j
              index += 1
          j += 1
      # print(j)
      #print(res)
      index = 0
      for key, values in res.items():
          if values != predictions[0]:
              final_res[index] = values
              print('final_res[index]:',final_res[index])
              index += 1
      #print(final_res)
      jobs_dict = {0:'AI ML Specialist',
                   1:'API Integration Specialist',
                   2:'Application Support Engineer',
                   3:'Business Analyst',
                   4:'Customer Service Executive',
                   5:'Cyber Security Specialist',
                   6:'Data Scientist',
                   7:'Database Administrator',
                   8:'Graphics Designer',
                   9:'Hardware Engineer',
                   10:'Helpdesk Engineer',
                   11:'Information Security Specialist',
                   12:'Networking Engineer',
                   13:'Project Manager',
                   14:'Software Developer',
                   15:'Software Tester',
                   16:'Technical Writer'}
                
      #print(jobs_dict[predictions[0]])
      job = {}
      #job[0] = jobs_dict[predictions[0]]
      index = 1
     
        
      data1=predictions
      print(data1)

      intrest=request.form['intrest']
      message = ""
      for key in final_res:
          print(final_res[key])
          print(intrest)
        #   if int(final_res[key])==(int(intrest)-1):
          message="The prediction was correct. Your area of intrest and our prediction has matched."
        #   else:
            # message="The prediction was incorrect."
      print(message)
      print("final_res",data1)
      return render_template("testafter.html",final_res=final_res,job_dict=jobs_dict,job0=data1,message=message)
                             
                             
      
# if __name__ == '__main__':
#    app.run(debug = True)

@app.route('/forgot',methods=['GET','POST'])
def forgot():
    msg = ""
    if request.method=="POST":
        email=request.form['email']
        password_length = 6
        print(secrets.token_urlsafe(password_length))
        password=secrets.token_urlsafe(password_length)
        x = Register.query.filter_by(email=email).first()
        if x != None:
            x.password = password
            db.session.commit()
            pass_mail(email,password)
            msg = 'Password updated, Please check your email'
        else:
            msg = 'This email id is not registrerd with us!'
    return render_template("forgot.html", msg = msg)



def pass_mail(email,password):
    msg = Message('Password ',
                  recipients=[email])
    msg.body = f'''Your Password is {password} '''
    mail.send(msg)


@app.route('/AI_ML_Specialist',methods=['GET','POST'])
def AI_ML_Specialist():
    return render_template("AI_ML_Specialist.html")



@app.route('/API_Integration_Specialist',methods=['GET','POST'])
def API_Integration_Specialist():
    return render_template("API_Integration_Specialist.html")


@app.route('/Penetration_Tester',methods=['GET','POST'])
def Penetration_Tester():
    return render_template("Penetration_Tester.html")


@app.route('/Application_Support_Engineer',methods=['GET','POST'])
def Application_Support_Engineer():
    return render_template("Application_Support_Engineer.html")


@app.route('/Business_Analyst',methods=['GET','POST'])
def Business_Analyst():
    return render_template("Business_Analyst.html")


@app.route('/Customer_service_executive',methods=['GET','POST'])
def Customer_service_executive():
    return render_template("Customer_service_executive.html")


@app.route('/Cyber_Security_Specialist',methods=['GET','POST'])
def Cyber_Security_Specialist():
    return render_template("Cyber_Security_Specialist.html")


@app.route('/Database_Administrator',methods=['GET','POST'])
def Database_Administrator():
    return render_template("Database_Administrator.html")


@app.route('/Data_Scientist',methods=['GET','POST'])
def Data_Scientist():
    return render_template("Data_Scientist.html")


@app.route('/Hardware_Engineer',methods=['GET','POST'])
def Hardware_Engineer():
    return render_template("Hardware_Engineer.html")


@app.route('/Helpdesk_Engineer',methods=['GET','POST'])
def Helpdesk_Engineer():
    return render_template("Helpdesk_Engineer.html")


@app.route('/Information_security',methods=['GET','POST'])
def Information_security():
    return render_template("Information_security.html")



@app.route('/Networking_engineer',methods=['GET','POST'])
def Networking_engineer():
    return render_template("Networking_engineer.html")



@app.route('/Project_Manager',methods=['GET','POST'])
def Project_Manager():
    return render_template("Project_Manager.html")


@app.route('/Software_developer',methods=['GET','POST'])
def Software_developer():
    return render_template("Software_developer.html")


@app.route('/Software_tester',methods=['GET','POST'])
def Software_tester():
    return render_template("Software_tester.html")


@app.route('/Technical_writer',methods=['GET','POST'])
def Technical_writer():
    return render_template("Technical_writer.html")


@app.route('/Graphic_Designer',methods=['GET','POST'])
def Graphic_Designer():
    return render_template("Graphic_Designer.html")


@login_required
@app.route("/logout")
def logout():
    logout_user()
    return redirect('/')