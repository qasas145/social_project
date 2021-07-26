"""
WSGI config for app2 project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""
import sqlite3
import os
# import eventlet
# import gevent
from gevent import pywsgi
import socketio
from django.core.wsgi import get_wsgi_application
# this the part of making that file like the modelClasses file that can't be imported for a problem
from datetime import datetime
db=sqlite3.connect('app2.db', check_same_thread=False)
cur=db.cursor()
# end of this part
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()

sio = socketio.Server(async_mode='gevent',cors_allowed_origins='*', logger=True, engineio_logger=True)

application = socketio.WSGIApp(sio, application)

# this the part of the function in that app

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
@sio.on('connected')
def connect(data, datamain) :
    print('the app has been connected')
    print(datamain)
@sio.on('distry')
def distry(data, datamain) :
    print('this the page of the connect that has the most of the ten to use in the next that has the most of ten to use in the desktop')
    print(datamain)
@sio.on('sendmsg')
def sendmsg(data, datamain) :
    now=datetime.utcnow()
    print(now.year, now.month, now.day, now.hour, now.minute, now.second)
    if now.hour==22 :
        cur.execute("INSERT INTO messages(content, email, email_reciever, year, month, day, hour, minute, second, email_deleting_one, email_deleting_two) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, 'none', 'none')", [datamain['content'], datamain['email'], datamain['email_reciever'], now.year, now.month, now.day+1, 00, now.minute, now.second])
        db.commit()
        sio.emit('sendedmsg', {
            "state" :True,
            "proccess" :"the messages has been added succussfully",
            "email" :datamain["email"],
            "email_reciever" :datamain['email_reciever']
        })
    elif now.hour==23:
        cur.execute("INSERT INTO messages(content, email, email_reciever, year, month, day, hour, minute, second, email_deleting_one, email_deleting_two) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, 'none', 'none')", [datamain['content'], datamain['email'], datamain['email_reciever'], now.year, now.month, now.day+1, 1, now.minute, now.second])
        db.commit()
        sio.emit('sendedmsg', {
            "state" :True,
            "proccess" :"the messages has been added succussfully",
            "email" :datamain["email"],
            "email_reciever" :datamain['email_reciever']
        })
    else :
        cur.execute("INSERT INTO messages(content, email, email_reciever, year, month, day, hour, minute, second, email_deleting_one, email_deleting_two) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, 'none', 'none')", [datamain['content'], datamain['email'], datamain['email_reciever'], now.year, now.month, now.day, now.hour+2, now.minute, now.second])
        db.commit()
        sio.emit('sendedmsg', {
            "state" :True,
            "proccess" :"the messages has been added succussfully",
            "email" :datamain["email"],
            "email_reciever" :datamain['email_reciever']
        })
# end of this part of the functions like the modelClasses in that app
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# eventlet.wsgi.server(eventlet.listen(('', 8000)), application)

# pywsgi.WSGIServer(('', 8000), application).serve_forever()
# pywsgi.WSGIServer(('', 8000), app).serve_forever()