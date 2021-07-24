import sqlite3
import threading
from datetime import datetime
from django.http import  HttpResponse, JsonResponse
db=sqlite3.connect('app2.db', check_same_thread=False)
cur=db.cursor()
lock=threading.Lock()
# part related to the active state and the last seen in that app
class updateState :
    def __init__(self, email, state, last_seen_year, last_seen_month, last_seen_day,last_seen_hour, last_seen_minute, last_seen_second) :
        self.email=email
        self.state=state
        self.last_seen_year=last_seen_year
        self.last_seen_month=last_seen_month
        self.last_seen_day=last_seen_day
        self.last_seen_hour=last_seen_hour
        self.last_seen_minute=last_seen_minute
        self.last_seen_second=last_seen_second
    def updateStateF(self) :
        res=cur.execute("SELECT * FROM state_active WHERE email=?", [self.email]).fetchall()
        try :
            if len(res) >=1 :
                cur.execute("UPDATE state_active set state=?,  last_seen_year=?, last_seen_month=?, last_seen_day=?, last_seen_hour=?, last_seen_minute=?, last_seen_second=? WHERE email=?", [self.state, self.last_seen_year, self.last_seen_month, self.last_seen_day, self.last_seen_hour, self.last_seen_minute, self.last_seen_second, self.email])
                db.commit()
                return JsonResponse({
                    "state" :True,
                    "proccess" :"the state of that email has been updated because it has been found already"
                })
            else :
                cur.execute("INSERT INTO state_active(email, state, last_seen_year, last_seen_month, last_seen_day, last_seen_hour, last_seen_minute, last_seen_second) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [self.email, self.state,  self.last_seen_year, self.last_seen_month, self.last_seen_day, self.last_seen_hour, self.last_seen_minute, self.last_seen_second])
                db.commit()
                return JsonResponse({
                    "state" :True,
                    "proccess" :"the state has been added "
                })
        except  :
            cur.execute("INSERT INTO state_active(email, state, last_seen_year, last_seen_month, last_seen_day, last_seen_hour, last_seen_minute, last_seen_second) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [self.email, self.state,  self.last_seen_year, self.last_seen_month, self.last_seen_day, self.last_seen_hour, self.last_seen_minute, self.last_seen_second])
            db.commit()
            return JsonResponse({
                "state" :True,
                "proccess" :"the state has been added "
            })         
# end of that part
class login_test:
    def __init__(self, data) :
        self.data=data
    def login(self) :
        cur.execute("SELECT * FROM user WHERE email=? AND password=?", (self.data['email'], self.data['password']))
        results=cur.fetchall()
        try :
            if len(results)>=1 :
                return JsonResponse({
                    "state":True,
                    "process" :"you have logged in successfully"
                })
            else :
                return JsonResponse({
                    "state" :False,
                    "process" :"the email or the password is incorrect "
                })
        except  :
            return JsonResponse({
                "state" :False,
                "process" :"the email or the password is incorrect"
            })
class signupC :
    def __init__(self, data) :
        self.data=data
    def signup_user(self) :
        # this the part of checing that the email is found or not 
        cur.execute("SELECT email FROM user")
        emails=cur.fetchall()
        res=[email for email in emails if email[0]==self.data['email']]
        if len(res)>=1 :
            print('there is emails with the same email')
            return JsonResponse({
                "state" :False,
                "process" :"that email has been already used "
            })
        else :
            # end of this part
            cur.execute("INSERT INTO user(name, email, username, pio,  profil_image, password) VALUES(?, ?, ?, ?, ?, ?)", (self.data['name'], self.data['email'], self.data['userName'], self.data['pio'], self.data['profilImage'],  self.data['password']))
            db.commit()
            return JsonResponse({
                "state" :True, 
                "process" :"you have signed up successfully"
            })
# this the part of the following part in that app 
class Follow :
    def __init__(self, email, email_wanted_to_follow) :
        self.email=email
        self.email_wanted_to_follow=email_wanted_to_follow
    def FollowF(self) :
        noofFollowing=noofFollowers=cur.execute("SELECT * FROM followers WHERE email_following=?", [self.email]).fetchall()
        check_first=cur.execute("SELECT * FROM followers WHERE email_followed=? AND email_following=?", [self.email_wanted_to_follow, self.email]).fetchone()
        try :
            if len(check_first)>=1 :
                cur.execute("DELETE FROM followers WHERE email_followed=? AND email_following=?", [self.email_wanted_to_follow, self.email])
                db.commit()
                cur.execute("UPDATE user SET following=? WHERE email=?",[(len(noofFollowing)-1), self.email])
                db.commit()
                noofFollowers=cur.execute("SELECT * FROM followers WHERE email_followed=?", [self.email_wanted_to_follow]).fetchall()
                cur.execute("UPDATE user SET followers=? WHERE email=?",[(len(noofFollowers)), self.email_wanted_to_follow])
                db.commit()
                return JsonResponse({
                    "state" :False,
                    "proccess" :"unfollowed"
                })
            else :
                cur.execute("INSERT INTO followers(email_followed, email_following) VALUES(? ,?)", [self.email_wanted_to_follow, self.email])
                db.commit()
                cur.execute("UPDATE user SET following=? WHERE email=?",[(len(noofFollowing)+1), self.email])
                db.commit()
                noofFollowers=cur.execute("SELECT * FROM followers WHERE email_followed=?", [self.email_wanted_to_follow]).fetchall()
                cur.execute("UPDATE user SET followers=? WHERE email=?",[len(noofFollowers), self.email_wanted_to_follow])
                db.commit()
                return JsonResponse({
                    "state" :True,
                    "proccess" :"you have followed him succussfully"
                })
        except  :
            cur.execute("INSERT INTO followers(email_followed, email_following) VALUES(? ,?)", [self.email_wanted_to_follow, self.email])
            db.commit()
            cur.execute("UPDATE user SET following=? WHERE email=?",[(len(noofFollowing)+1), self.email])
            db.commit()
            noofFollowers=cur.execute("SELECT * FROM followers WHERE email_followed=?", [self.email_wanted_to_follow]).fetchall()
            cur.execute("UPDATE user SET followers=? WHERE email=?",[len(noofFollowers), self.email_wanted_to_follow])
            db.commit()
            return JsonResponse({
                "state" :True,
                "proccess" :"you have followed him succussfully"
            })
class addFeatures:
    def add_feature(self) :
        # cur.execute("UPDATE messages SET email_deleting_one='none', email_deleting_two='none'")
        # db.commit()
        # cur.execute("ALTER TABLE messages ALTER COLUMN email_deleting_one VARCHAR(50) DEFAULT 'none'")
        # db.commit())
        cur.execute("DELETE FROM messages")
        db.commit()
        # cur.execute("ALTER TABLE messages ADD COLUMN id INTEGER")
        # db.commit()
        # cur.execute("ALTER TABLE messages ADD COLUMN seen BOOLEAN DEFAULT false")
        # db.commit()
        # cur.execute("CREATE TABLE IF NOT EXISTS state_active(email VARCHAR(50), state BOOLEAN DEFAULT false, last_seen_year INTEGER, last_seen_month INTEGER, last_seen_day INTEGER, last_seen_hour INTEGER, last_seen_minute INTEGER, last_seen_second INTEGER, FOREIGN KEY(email) REFERENCES user(email))")
        # db.commit()
        # cur.execute("DELETE FROM state_active")
        # db.commit()
        # cur.execute("ALTER TABLE messages ADD COLUMN email_deleting_one VARCHAR(50)")
        # db.commit()
        # cur.execute("ALTER TABLE messages ADD FOREIGN KEY (email_deleting_one) REFERENCES user(email)")
        # db.commit()
        # cur.execute("ALTER TABLE messages ADD COLUMN email_deleting_two VARCHAR(50)")
        # db.commit()
        # cur.execute("ALTER TABLE messages ADD FOREIGN KEY (email_deleting_two) REFERENCES user(email)")
        # db.commit()
        # cur.execute("SELECT * FROM messages WHERE email=? OR email_reciever=?", ['mariem@gmail.com', 'mariem@gmail.com'])
        # res=cur.fetchall()
        # data_msgs=[]
        # data_emails=[]
        # data_emails_set=[]
        # # part of letting the constants the vars of the list for the list of the date in that app
        # list_dates=[]
        # list_dates_filtered=[]
        # # end of this part in this app
        # # part of the getting the date of the msgs in that app
        # for data in res :
        #     data_json={
        #         "content" :data[0],
        #         "email" :data[1],
        #         "email_reciever" :data[2],
        #         "year" :data[3],
        #         "month" :data[4],
        #         "day" :data[5]
        #     }
        #     data_msgs.append(data_json)
        # this the part of filtering the data in the message accroding to the date in that app
        # for data in data_msgs :
        #     list_dates.append((data['year'], data['month'], data['day']))
        # end of that part
        # this the part of removing the duplicates in that app
        # for data in list_dates :
        #     if data not in list_dates_filtered :
        #         list_dates_filtered.append(data)
        # print(list_dates_filtered)
        # end of this part in that app
        # this the part of getting the messages for this app where date equal to the date in that app
        # De Of the list that will hold the messages in that app
        # end of this part in this app
        # holdingMessages=[]
        # end of that part in this app
        # for date in list_dates_filtered :
        #     holdingList=[]
        #     for data in data_msgs :
        #         if (data['year'], data['month'], data['day'])==date :
        #             holdingList.append(data)
        #             print('no matches ')
        #     data_filtered_by_date={
        #         "date" :date,
        #         "messages" :holdingList,
        #     }
        #     holdingMessages.append(data_filtered_by_date)
        #     # holdingList.clear()
        # # end of this part in that app
        # for data in data_msgs :
        #     data_emails.append(data['email'])
        #     data_emails.append(data['email_reciever'])
        # for data in data_emails :
        #     if data not in data_emails_set :
        #         data_emails_set.append(data)
        # for email in data_emails_set :
        #     print(email)
        # return JsonResponse(holdingMessages, safe=False)
        # cur.execute("CREATE TABLE IF NOT EXISTS messages(content TEXT, email VARCHAR(50), email_reciever VARCHAR(50), year INTEGER, month INTEGER, day INTEGER, hour INTEGER, minute INTEGER, second INTEGER , FOREIGN KEY(email) REFERENCES user(email), FOREIGN KEY(email_reciever) REFERENCES user(email))")
        # db.commit()
        # cur.execute("CREATE TABLE IF NOT EXISTS savedposts(post_id INTEGER PRIMARY KEY, email VARCHAR(50), FOREIGN KEY(post_id) REFERENCES posts(id), FOREIGN KEY(email) REFERENCES user(email))")
        # db.commit()
        # cur.execute("CREATE TABLE IF NOT EXISTS sharedposts(post_id INTEGER, email VARCHAR(50), FOREIGN KEY(post_id) REFERENCES posts(id), FOREIGN KEY(email) REFERENCES user(email))")
        # db.commit()
        # cur.execute("ALTER TABLE posts ADD COLUMN shared_post_id")
        # cur.execute("ALTER TABLE posts ADD COLUMN shared_post_state BOOLEAN DEFAULT false")
        # cur.execute("ALTER TABLE posts ADD FOREIGN KEY(shared_post_id) REFERENCES posts(id)")
        # db.commit()
        # cur.execute("CREATE TABLE IF NOT EXISTS followers(email_followed VARCAHR(50), email_following VARCHAR(50), FOREIGN KEY(email_followed) REFERENCES user(email), FOREIGN KEY(email_following) REFERENCES user(email))")
        # db.commit()
        # cur.execute("ALTER TABLE posts ADD COLUMN saved BOOLEAN DEFAULT false")
        # db.commit()
        # cur.execute("CREATE TABLE IF NOT EXISTS likes(liked BOOLEAN, email VARCHAR(50), email_owner_post VARCHAR(50), post_id INTEGER, FOREIGN KEY(email) REFERENCES user(email), FOREIGN KEY(email_owner_post) REFERENCES user(email), FOREIGN KEY(post_id) REFERENCES posts(id))")
        # db.commit()
        # cur.execute("DELETE FROM likes")
        # db.commit()
        # making a new table of the commenting on the posts
        # cur.execute("CREATE TABLE IF NOT EXISTS comments(comment VARCHAR(255), email VARCHAR(50), post_id INTEGER, email_owner_post VARCHAR(50), year INTEGRER, month INTEGER, day INTEGER, hour INTEGER, minute INTEGER, second INTEGER, FOREIGN KEY(email) REFERENCES  user(email), FOREIGN KEY(post_id) REFERENCES  posts(id))")
        # db.commit()
        # end of this new table 
        # cur.execute("DELETE FROM comments")
        # db.commit()
class addPosts :
    def __init__(self, email, content, image_src) :
        self.email=email
        self.content=content
        self.image_src=image_src
    def addPost(self) :
        now=datetime.utcnow()
        cur.execute("INSERT INTO posts(email, pio, image, year, month, day, hour, minute, second, likes, comments, shares) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (self.email, self.content, self.image_src, now.year, now.month, now.day, now.hour+2, now.minute, now.second, 0, 0, 0))
        db.commit()
class editName :
    def __init__(self, email, newname, password) :
        self.email=email
        self.newname=newname
        self.password=password
    def editNameF(self) :
        cur.execute("SELECT * FROM user WHERE email=? AND password=?", [self.email, self.password])
        res=cur.fetchall()
        try :
            if len(res)>=1 :
                cur.execute("UPDATE user SET name=? WHERE email=?", [self.newname, self.email])
                db.commit()
                return JsonResponse([{
                    "state" :True,
                    "proccess" :"updated succussfelly",
                    "id" :1
                }], safe=False)
                return JsonResponse([{
                    "state" :False,
                    "proccess" :"the password is incorrect"
                }])
            else :
                return JsonResponse([{
                    "state" :False,
                    "proccess" :"the password is incorrect"
                }], safe=False)
        except  :
            return JsonResponse([{
                "state" :False,
                "proccess" :"the password is incorrect"
            }], safe=False)
class editEmail :
    def __init__(self, email, newemail, password) :
        self.email=email
        self.newemail=newemail
        self.password=password
    def editEmailF(self) :
        cur.execute("SELECT * FROM user WHERE email=? AND password=?", [self.email, self.password])
        res=cur.fetchall()
        try :
            if len(res)>=1 :
                cur.execute("UPDATE user SET email=? WHERE email=?", [self.newemail, self.email])
                db.commit()
                return JsonResponse([{
                    "state" :True,
                    "proccess" :"updated succussfelly",
                    "id" :1
                }], safe=False)
            else :
                return JsonResponse([{
                    "state" :False,
                    "proccess" :"the password is not correct"
                }], safe=False)
        except :
            return JsonResponse([{
                "state" :False,
                "proccess" :"the password is not correct"
            }], safe=False)
class editUserName :
    def __init__(self, email, newusername, password) :
        self.email=email
        self.newusername=newusername
        self.password=password
    def editUserNameF(self) :
        cur.execute("SELECT * FROM user WHERE email=? AND password=?", [self.email, self.password])
        res=cur.fetchall()
        try :
            if len(res)>=1 :
                cur.execute("UPDATE user SET username=? WHERE email=?", [self.newusername, self.email])
                db.commit()
                return JsonResponse([{
                    "state" :True,
                    "proccess" :"updated succussfelly",
                    "id" :1
                }], safe=False)
            else :
                return JsonResponse([{
                    "state" :False,
                    "proccess" :"the password is incorrect"
                }], safe=False)
        except  :
            return JsonResponse([{
                "state" :False,
                "proccess" :"the password is incorrect"
            }], safe=False)
class editPio :
    def __init__(self, email, newpio, password) :
        self.email=email
        self.newpio=newpio
        self.password=password
    def editPioF(self) :
        cur.execute("SELECT * FROM user WHERE email=? AND password=?", [self.email, self.password])
        res=cur.fetchall()
        try :
            if len(res)>=1 :
                cur.execute("UPDATE user SET pio=? WHERE email=?", [self.newpio, self.email])
                db.commit()
                return JsonResponse([{
                    "state" :True,
                    "proccess" :"updated succussfelly",
                    "id" :1
                }], safe=False)
            else :
                return JsonResponse([{
                    "state" :False,
                    "proccess" :"the password is incorrect"
                }], safe=False)
        except  :
            return JsonResponse([{
                "state" :False,
                "proccess" :"the password is incorrect"
            }], safe=False)
class editProfilImage :
    def __init__(self, email, newprofilimage) :
        self.email=email
        self.newprofilimage=newprofilimage
    def editProfilImageF(self) :
        cur.execute("UPDATE user SET profil_image=? WHERE email=?", [self.newprofilimage, self.email])
        db.commit()
        return JsonResponse([{
            "state" :True,
            "proccess" :"updated succussfelly",
            "id" :1
        }], safe=False)
class editPassword :
    def __init__(self, email, oldpassword, newpassword) :
        self.email=email
        self.oldpassword=oldpassword
        self.newpassword=newpassword
    def editPasswordF(self) :
        res=cur.execute("SELECT password FROM user WHERE email=?", [self.password]).fetchone()
        if res[0]==self.oldpassword:
            cur.execute("UPDATE user SET password=? WHERE email=?",[self.newpassword, self.email])
            db.commit()
            return JsonResponse([{
                "state" :True,
                "proccess" :"password has been uptaded successfully" ,
                "id" :1
            }], safe=False)
        else :
            return JsonResponse([{
                "state" :False,
                "proccess" :"the old password is incorrect",
                "id" :1
            }], safe=False)
# this the part of the processes at the posts 
class addComment:
    def __init__(self, email, email_post_owner,  comment, post_id) :
        self.email=email
        self.email_post_owner=email_post_owner
        self.comment=comment
        self.post_id=post_id
    def addCommentF(self) :
        now=datetime.utcnow()
        n_comments=cur.execute("SELECT comments FROM posts WHERE id=?", [self.post_id]).fetchone()
        cur.execute("INSERT INTO comments(comment, email, post_id, email_owner_post, year, month, day, hour, minute, second) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [self.comment, self.email, self.post_id, self.email_post_owner,  now.year, now.month, now.day, now.hour+2, now.minute, now.second])
        cur.execute("UPDATE posts SET comments=? WHERE id=?", [n_comments[0]+1, self.post_id])
        db.commit()
        return JsonResponse({
            "state" :True,
            "process" :"the comment added successfully"
        })
class DeleteComment :
    def __init__(self, email, year, month, day, hour, minute, second, post_id) :
        self.email=email
        self.year=year
        self.month=month
        self.day=day
        self.hour=hour
        self.minute=minute
        self.second=second
        self.post_id=post_id
    def deleteCommentF(self) :
        cur.execute("DELETE FROM comments WHERE post_id=? AND email=? AND year=? AND month=? AND day=? AND hour=? AND minute=? AND second=?", [self.post_id, self.email,  self.year, self.month, self.day, self.hour, self.minute, self.second])
        db.commit()
        n_comments=cur.execute("SELECT comments FROM posts WHERE id=?", [self.post_id]).fetchone()
        cur.execute("UPDATE posts SET comments=? WHERE id=?", [n_comments[0]-1, self.post_id])
        db.commit()
        return JsonResponse({
            "state" :True,
            "proccess" :"the comment has been deleted successfully"
        })
class getComments:
    def __init__(self, email, post_id) :
        self.email=email
        self.post_id=post_id
    def getCommentsF(self) :
        res=cur.execute("SELECT * FROM comments WHERE email_owner_post=? AND post_id=?", [self.email, self.post_id]).fetchall()
        list_data=[]
        for i in range(0, len(res)) :
            cur.execute("SELECT name, username, profil_image FROM user WHERE email='qasas145@gmail.com'")
            profil_data_list=cur.fetchone()
            data={
                "comment" :res[i][0],
                "email" :res[i][1],
                "postId" :res[i][2],
                "emailOwnerPost" :res[i][3],
                "year" :res[i][4],
                'month':res[i][5],
                "day":res[i][6],
                "hour":res[i][7],
                "minute" :res[i][8],
                "second" :res[i][9],
                "name" :profil_data_list[0],
                "userName":profil_data_list[1],
                "profilImage" :profil_data_list[2],
                "id" :i
            }
            list_data.append(data)
        return JsonResponse(list_data, safe=False)
class addLike:
    def __init__(self, email, email_owner_post,  post_id) :
        self.email=email
        self.email_owner_post=email_owner_post
        self.post_id=post_id
    def addLikeF(self) :
        checkLiked=cur.execute("SELECT liked FROM likes WHERE post_id=? AND email=?", [self.post_id, self.email]).fetchone()
        try :
            if checkLiked[0]==1 :
                cur.execute("DELETE FROM likes WHERE email=? AND post_id=?", [self.email, self.post_id])
                db.commit()
                nolikes=cur.execute("SELECT * FROM likes WHERE post_id=?", [self.post_id]).fetchall()
                cur.execute("UPDATE posts set likes=? WHERE id=?", [len(nolikes), self.post_id])
                db.commit()
                return JsonResponse({
                    "state" :False,
                    "proccess" :"the post is liked already from you then we have removed the like "
                })
            else :
                cur.execute('INSERT INTO likes(liked, email, email_owner_post, post_id) VALUES(?, ?, ?, ?)', [True, self.email, self.email_owner_post, self.post_id])
                db.commit()
                nolikes=cur.execute("SELECT * FROM likes WHERE post_id=?", [self.post_id]).fetchall()
                cur.execute("UPDATE posts set likes=? WHERE id=?", [len(nolikes), self.post_id])
                db.commit()
                return JsonResponse({
                    "state" :True,
                    "proccess" :"liked added successfully"
                })
        except  :
            cur.execute('INSERT INTO likes(liked, email, email_owner_post, post_id) VALUES(?, ?, ?, ?)', [True, self.email, self.email_owner_post, self.post_id])
            db.commit()
            nolikes=cur.execute("SELECT * FROM likes WHERE post_id=?", [self.post_id]).fetchall()
            cur.execute("UPDATE posts set likes=? WHERE id=?", [len(nolikes), self.post_id])
            db.commit()
            return JsonResponse({
                "state" :True,
                "proccess" :"liked added successfully"
            })
class deletePost :
    def __init__(self, email, post_id) :
        self.email=email
        self.post_id=post_id
    def deletePostF(self) :
        cur.execute('DELETE FROM posts WHERE email=? AND id=?', [self.email, self.post_id])
        cur.execute("DELETE FROM likes WHERE email_owner_post=? AND post_id=?", [self.email, self.post_id])
        cur.execute("DELETE FROM comments WHERE email_owner_post=? AND post_id=?", [self.email, self.post_id])
        db.commit()
        return JsonResponse({
            "state" :True,
            "proccess" :"deleted succussfully"
        })
class editPost :
    def __init__(self, email, post_id,  newpio) :
        self.email=email
        self.post_id=post_id
        self.newpio=newpio
    def editPostF(self) :
        cur.execute("UPDATE posts SET pio=? WHERE email=? AND id=?", [self.newpio, self.email, self.post_id])
        db.commit()
        return JsonResponse({
            "state" :True,
            "proccess" :"edited succussfully"
        })
class savePost :
    def __init__(self, email, post_id) :
        self.email=email
        self.post_id=post_id
    def savePostF(self) :
        # this the part of checing first in that app
        checkSavedOrNot=cur.execute("SELECT * FROM savedposts WHERE email=? AND post_id=?", [self.email, self.post_id]).fetchall()
        try :
            if len(checkSavedOrNot) >=1 :
                cur.execute("DELETE FROM savedposts WHERE post_id=? AND email=?", [self.post_id, self.email])
                db.commit()
                return JsonResponse({
                    "state" :True,
                    "proccess" :"unsaved succussfully"
                })
                # end of this but the function is as it before 
            else :
                cur.execute("INSERT INTO savedposts(post_id, email) VALUES(?, ?)", [self.post_id, self.email])
                cur.execute("UPDATE posts SET saved=true WHERE id=?", [self.post_id])
                db.commit()
                return JsonResponse({
                    "state" :True,
                    "proccess" :"saved succussfully"
                })
        except  :
            cur.execute("INSERT INTO savedposts(post_id, email) VALUES(?, ?)", [self.post_id, self.email])
            cur.execute("UPDATE posts SET saved=true WHERE id=?", [self.post_id])
            db.commit()
            return JsonResponse({
                "state" :True,
                "proccess" :"saved succussfully"
            })
class sharePost :
    def __init__(self, email, post_id, pio) :
        self.email=email
        self.post_id=post_id
        self.pio=pio
    def sharePostF(self) :
        now=datetime.utcnow()
        cur.execute("INSERT INTO posts(email, pio, year, month, day, hour, minute, second, likes, comments, shares, shared_post_id, shared_post_state) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[self.email, self.pio, now.year, now.month, now.day, now.hour+2, now.minute, now.second, 0, 0, 0,  self.post_id, "true"])
        db.commit()
        return JsonResponse({
            "state" :True,
            "proccess" :"the post has been shared succussfully"
        })
class Search :
    def __init__(self, email, name) :
        self.email=email
        self.name=name
    def SearchF(self) :
        list_data=[]
        if self.name=="" :
            print('the app')
        else :
            res=cur.execute("SELECT * FROM user").fetchall()
            for n in range(0, len(res)) :
                if self.name in res[n][0] :
                    if res[n][1]==self.email:
                        print('this the login email not shown in this app')
                    else :
                        data={
                            "name" :res[n][0],
                            "email" :res[n][1],
                            "password" :res[n][2],
                            "username" :res[n][3],
                            "pio" :res[n][4],
                            "followers" :res[n][5],
                            "following" :res[n][6],
                            "profilimage" :res[n][7],
                            "id" :n
                        }
                        list_data.append(data)
                else :
                    print('there is no search ')
        return JsonResponse(list_data, safe=False)
class checkEmailNotFound :
    def __init__(self, email) :
        self.email = email
    def checkEmail(self) :
        cur.execute("SELECT email FROM user")
        emails=cur.fetchall()
        print(emails)
        check=[em for em in emails if em[0]==self.email]
        print(len(check))
        return JsonResponse({
            "state" :"this the page of checking that the email entered is unique"
        }, safe=False)