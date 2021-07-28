from django.shortcuts import render
from django.http import  HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import socketio
# end of this part in that app
from modelClasses import login_test, signupC, addFeatures, addPosts,editName, editPio, editUserName, editEmail,  checkEmailNotFound, editPassword, editProfilImage, addComment, getComments, addLike, deletePost, editPost, savePost, sharePost, Search, DeleteComment, Follow, updateState
import json
import sqlite3
db=sqlite3.connect('app2.db', check_same_thread=False)
@csrf_exempt 
def signup(request) :
    Signup=signupC(json.loads(request.body))
    return Signup.signup_user()
@csrf_exempt
def login(request) :
    Login_Test=login_test(json.loads(request.body))
    return Login_Test.login()
@csrf_exempt
def getFollowingEmailsF(request) :
    data=json.loads(request.body)
    return getFollowingEmailsFunction(data)
@csrf_exempt
def FollowF(request) :
    data=json.loads(request.body)
    FollowC=Follow(data['email'], data['email_wanted_to_follow'])
    return FollowC.FollowF()
@csrf_exempt
def profil_data(request):
    data=json.loads(request.body)
    return profilDataFunction(data)
@csrf_exempt
def addFeatures_one(request) :
    data=json.loads(request.body)
    addFeatures_two=addFeatures()
    addFeatures_two.add_feature()
    return HttpResponse('this the app of me in that app')
@csrf_exempt
def addpost(request) :
    data=json.loads(request.body)
    addingPosts=addPosts(data['email'], data['content'], data['image_src'])
    addingPosts.addPost()
    return JsonResponse({
        "state" :"the process of adding the post is a success "
    })
@csrf_exempt
def getposts(request) :
    data=json.loads(request.body)
    cur=db.cursor()
    return getPostsFunction(data)
@csrf_exempt
def editNameD(request) :
    data=json.loads(request.body)
    print(data)
    editNameC=editName(data['email'], data['newname'], data['password'])
    return editNameC.editNameF()
@csrf_exempt
def editPioD(request) :
    data=json.loads(request.body)
    editPioC=editPio(data['email'], data['newpio'], data['password'])
    return editPioC.editPioF()
@csrf_exempt
def editUserNameD(request) :
    data=json.loads(request.body)
    editUserNameC=editUserName(data['email'], data['newusername'], data['password'])
    return editUserNameC.editUserNameF()
@csrf_exempt
def editEmailD(request) :
    data=json.loads(request.body)
    editEmailC=editEmail(data['email'], data['newemail'], data['password'])
    return editEmailC.editEmailF()
@csrf_exempt
def editPasswordD(request) :
    data=json.loads(request.body)
    editPasswordC=editPassword(data['email'], data['oldpassword'], data['newpassword'])
    return editPasswordC.editPasswordF()
@csrf_exempt
def editProfilImageD(request) :
    data=json.loads(request.body)
    editProfilImageC=editProfilImage(data['email'], data['newprofilimage'])
    return editProfilImageC.editProfilImageF()
@csrf_exempt
def addcommentD(request) :
    data=json.loads(request.body)
    addCommentC=addComment(data['email'], data['email_post_owner'], data['comment'], data['post_id'])
    return addCommentC.addCommentF()
@csrf_exempt
def DeleteCommentF(request) :
    data=json.loads(request.body)
    DeleteCommentC=DeleteComment(data['email'], data['year'], data['month'], data['day'], data['hour'], data['minute'], data['second'], data['post_id'])
    return DeleteCommentC.deleteCommentF()
@csrf_exempt
def getCommentsD(request) :
    data=json.loads(request.body)
    getCommentsC=getComments(data['email_owner_post'], data['post_id'])
    return getCommentsC.getCommentsF()
@csrf_exempt
def addLikeD(request) :
    data=json.loads(request.body)
    addLikeC=addLike(data['email'], data['email_owner_post'], data['post_id'])
    return addLikeC.addLikeF()
@csrf_exempt
def deletePostF(request) :
    data=json.loads(request.body)
    deletePostC=deletePost(data['email'], data['post_id'])
    return deletePostC.deletePostF()
@csrf_exempt
def editPostF(request) :
    data=json.loads(request.body)
    print(data)
    editPostC=editPost(data['email'], data['post_id'], data['newpio'])
    return editPostC.editPostF()
@csrf_exempt
def savePostF(request) :
    data=json.loads(request.body)
    savePostC=savePost(data['email'], data['post_id'])
    return savePostC.savePostF()
@csrf_exempt
def getSavedPostsF(request) :
    data=json.loads(request.body)
    return getSavedPostsFunction(data['email'])
@csrf_exempt
def getSharedPostsF(request) :
    data=json.loads(request.body)
    return getSharedPostsFunction(data)
@csrf_exempt
def getPost(request) :
    data=json.loads(request.body)
    return getPostFunction(data)
@csrf_exempt
def sharePostF(request) :
    data=json.loads(request.body)
    sharePostC=sharePost(data['email'], data['post_id'], data['pio'])
    return sharePostC.sharePostF()
@csrf_exempt 
def SearchF(request) :
    data=json.loads(request.body)
    SearchC=Search(data['email'], data['search'])
    return SearchC.SearchF()
@csrf_exempt
def getFollowersF(request) :
    data=json.loads(request.body)
    return getFollowersFunction(data)
@csrf_exempt
def getFollowingF(request) :
    data=json.loads(request.body)
    return getFollowingFuction(data)
@csrf_exempt
def getMainDataF(request) :
    data=json.loads(request.body)
    return getMainDataFunction(data)
@csrf_exempt
def getRooms(request) :
    data=json.loads(request.body)
    return getRoomsFuntion(data['email'])
@csrf_exempt
def seenMessagesF(request) :
    data=json.loads(request.body)
    print(data)
    cur=db.cursor()
    cur.execute("UPDATE messages SET seen=true WHERE email=? AND email_reciever=?", [data['email_reciever'], data['email']])
    db.commit()
    return JsonResponse({
        "state" :True,
        "proccess" :"the messages has been seened successfully"
    })
@csrf_exempt
def updateStateF(request) :
    data=json.loads(request.body)
    updateStateC=updateState(data['email'], data['state'], data['last_seen_year'], data['last_seen_month'], data['last_seen_day'], data['last_seen_hour'], data['last_seen_minute'], data['last_seen_second'])
    return updateStateC.updateStateF()
@csrf_exempt
def deleteChatF(request) :
    data=json.loads(request.body)
    return deleteChatFunction(data)
# this the part of the divs function in that app
# this the part of reversing teh lists in that app
def Reverse(lst) :
    return [ele for ele in reversed(lst)]
# end of that part
# this the part of setting the email deleting in that app
def deleteChatFunction(data) :
    print(data)
    cur=db.cursor()
    cur.execute("SELECT email_deleting_one FROM messages WHERE email=? AND email_reciever=? OR email=? AND email_reciever=?", [data['email'], data['email_reciever'], data['email_reciever'], data['email']])
    res=cur.fetchall()
    # this the part of the checking that there is an oldest email who has deleted the messages before or not
    list_states_filtered=[]
    list_states=[]
    try :
        # collecting all the words in that app
        for response in res :
            if res[0]=='none' :
                list_states.append('none')
            else :
                list_states.append('found')
        # filtering the words in that app
        for wo in list_states :
            if wo not in list_states_filtered :
                list_states_filtered.append(wo)
    # end of that part i that app
        if 'found' in list_states_filtered :
            cur.execute("UPDATE messages SET email_deleting_two=? WHERE email=? AND email_reciever=? OR email=? AND email_reciever=?",  [data['email'] ,data['email'], data['email_reciever'], data['email_reciever'], data['email']])
            db.commit()
            return JsonResponse({
                "state" :True,
                "proccess" :"the email has been added in the column that has the name :deletig_email_two"
            })
        else :
            cur.execute("UPDATE messages SET email_deleting_one=? WHERE email=? AND email_reciever=? OR email=? AND email_reciever=?",  [data['email'], data['email'], data['email_reciever'], data['email_reciever'], data['email']])
            db.commit()
            return JsonResponse({
                "state" :True,
                "proccess" :"the email has been added in the column that has the name : deleting_email_one"
            })
    except :
        cur.execute("UPDATE messages SET email_deleting_one=? WHERE email=? AND email_reciever=? OR email=? AND email_reciever=?",  [data['email'], data['email'], data['email_reciever'], data['email_reciever'], data['email']])
        db.commit()
        return JsonResponse({
            "state" :True,
            "proccess" :"the email has been added in the column that has the name : deleting_email_one"
        })
#this the part of getting the rooms in that app
    # this the part of getting only the name and the email and the profil image from that app
def getMainDataFunction(res) :
    list=[]
    cur=db.cursor()
    for i in range(0, len(res)) :
        profil_data=cur.execute("SELECT profil_image, name, email FROM user WHERE email=?", [res[i]['email']]).fetchall()
        data_list={
            "profilimage" :profil_data[0][0],
            "name" :profil_data[0][1],
            "email" :profil_data[0][2],
            "id" :i
        }
        list.append(data_list)
    return JsonResponse(list, safe=False)
    # this the part of getting the followers in that app
def getRoomsFuntion(data_email) :
    cur=db.cursor()
    cur.execute("SELECT * FROM messages WHERE email=? AND email_deleting_one!=? AND email_deleting_two!=? OR email_reciever=? AND email_deleting_one!=? AND email_deleting_two!=?", [data_email, data_email, data_email, data_email, data_email, data_email])
    res=cur.fetchall()
    data_msgs=[]
    data_emails=[]
    data_emails_set=[]
    all_data=[]
    for data in res :
        data_json={
            "content" :data[0],
            "email" :data[1],
            "email_reciever" :data[2]
        }
        data_msgs.append(data_json) 
    for data in data_msgs :
        data_emails.append(data['email'])
        data_emails.append(data['email_reciever'])
    data_emails_reversed=Reverse(data_emails)
    for email in data_emails_reversed :
        if email not in data_emails_set and email!=data_email:
            data_emails_set.append(email)
    # part of reversing the list in python
    # end of this part in that app
    print(data_emails_set)
    for email in data_emails_set :
        cur=db.cursor()
        # this the part of getting the state active in that app
        res_state_active=cur.execute("SELECT * FROM state_active WHERE email=?", [email]).fetchall()
        # end of that app 
        # this the part of the getting the messages between the two emails i that app
        list_messages=[]
        cur.execute("SELECT * FROM messages WHERE email=? AND email_deleting_one!=? AND email_deleting_two!=? OR email_reciever=? AND email_deleting_one!=? AND email_deleting_two!=?", [data_email, data_email, data_email, data_email, data_email, data_email])
        msgs_res=cur.fetchall()
        for msg in msgs_res :
            data_msg_json={
                "content" :msg[0],
                "email" :msg[1],
                "email_reciever" :msg[2],
                "year" :msg[3],
                "month" :msg[4],
                "day" :msg[5],
                "hour" :msg[6],
                "minute" :msg[7],
                "second" :msg[8],
                "id" :msg[8],
                "seen" :msg[10]
            }
            list_messages.append(data_msg_json)
        # end of that part
        # this the part of getting the unseened messages for the other email in that app
        unseen_mesages_number_without_filtering=[]
        unseen_messages_number_filtered=[]
        cur.execute("SELECT * FROM messages WHERE email=? AND email_reciever=? AND seen=0", [email, data_email])
        unseen_mesages_list=cur.fetchall()
        try :
            unseen_mesages_number_without_filtering.append(len(unseen_mesages_list))
        except :
            unseen_mesages_number_without_filtering.append(0)
        for num in unseen_mesages_number_without_filtering :
            if num not in unseen_messages_number_filtered :
                unseen_messages_number_filtered.append(num)
        # end of that app in this part
        # part of filtering the messages by the date of it in that app
        list_messages_filtered=[]
        list_dates_without_filtering=[]
        list_dates_filtered=[]
        for data in list_messages :
            list_dates_without_filtering.append((data['year'], data['month'], data['day']))
        for data in list_dates_without_filtering :
            if data not in list_dates_filtered :
                list_dates_filtered.append(data)
        for date in list_dates_filtered :
            list_holding_messages_filtered=[]
            for data in list_messages :
                if (data['year'], data['month'], data['day'])==date :
                    list_holding_messages_filtered.append(data)
            data_messages_filtered={
                "date" :date,
                "messages" :list_holding_messages_filtered
            }
            list_messages_filtered.append(data_messages_filtered)
        # end of that part
        list=[]
        last_msg_list=cur.execute("SELECT * FROM messages WHERE email=? AND email_deleting_one!=? AND email_deleting_two!=? OR email_reciever=? AND email_deleting_one!=? AND email_deleting_two!=?", [data_email, data_email, data_email, data_email, data_email, data_email]).fetchall()
        cur.execute("SELECT profil_image, name, email FROM user WHERE email=?", [email])
        profil_data=cur.fetchall()
        cur.execute("SELECT profil_image, name, email FROM user WHERE email=?", [data_email])
        profil_data1=cur.fetchall()
        date=f"{last_msg_list[-1][5]}/{last_msg_list[-1][4]}/{last_msg_list[-1][3]}"
        try :
            data_list={
                "profilimage" :profil_data[0][0],
                "name" :profil_data[0][1],
                "profilimage_login" :profil_data1[0][0],
                "name_login" :profil_data1[0][1],
                "email" :profil_data[0][2],
                "content" :last_msg_list[-1][0],
                "date" :date,
                "email_s" :last_msg_list[-1][1],
                "messages" :list_messages_filtered,
                "unseen_messages" :unseen_messages_number_filtered[0],
                "state_active" :res_state_active,
            }
            all_data.append(data_list)
        except :
            print('the email is not valid in that app')
    return JsonResponse(all_data, safe=False)
def getFollowersFunction(data) :
    list=[]
    cur=db.cursor()
    cur.execute("SELECT * FROM followers WHERE email_followed=?", [data['email']])
    res=cur.fetchall()
    for i in range(0, len(res)) :
        profil_data=cur.execute("SELECT profil_image, name, email FROM user WHERE email=?", [res[i][1]]).fetchall()
        data_list={
            "profilimage" :profil_data[0][0],
            "name" :profil_data[0][1],
            "email" :profil_data[0][2],
            "id" :i
        }
        list.append(data_list)
    return JsonResponse(list, safe=False)
def getFollowingFuction(data) :
    list=[]
    cur=db.cursor()
    cur.execute("SELECT * FROM followers WHERE email_following=?", [data['email']])
    res=cur.fetchall()
    for i in range(0, len(res)) :
        profil_data=cur.execute("SELECT profil_image, name, email FROM user WHERE email=?", [res[i][0]]).fetchall()
        data_list={
            "profilimage" :profil_data[0][0],
            "name" :profil_data[0][1],
            "email" :profil_data[0][2],
            "id" :i
        }
        list.append(data_list)
    return JsonResponse(list, safe=False)
def getPostsFunction(data):
    cur=db.cursor()
    cur.execute(f"SELECT profil_image, name FROM user WHERE email=?", [data['email']])
    profilImage=cur.fetchone()
    res=cur.execute('SELECT * FROM POSTS WHERE email=? ORDER BY id DESC', [data['email']]).fetchall()
    list_posts=[]
    for n in range(0, len(res)) :
        # this the part related to the getting the comments and as other the next part is the getting likes in that app
        comments=[]
        comments.clear()
        cur.execute("SELECT * FROM comments WHERE email_owner_post=? AND post_id=?", [data['email'], res[n][12]])
        data_comments=cur.fetchall()
        for i in range(0, len(data_comments)) :
            profil_data=cur.execute("SELECT name, profil_image FROM user WHERE email=?", [data_comments[i][1]]).fetchone() 
            data_comments_json={
                "comment" :data_comments[i][0],
                "email" :data_comments[i][1],
                "name" :profil_data[0],
                "profilImage" :profil_data[1],
                "postId" :data_comments[i][2],
                "emailOwnerPost" :data_comments[i][3],
                "year" :data_comments[i][4],
                'month':data_comments[i][5],
                "day":data_comments[i][6],
                "hour":data_comments[i][7],
                "minute" :data_comments[i][8],
                "second" :data_comments[i][9],
                "id" :i
            }
            comments.append(data_comments_json) 
        # end of the getting the comments in that app
        # this the part of getting the likes in that app
        likes=[]
        likes.clear()
        data_likes=cur.execute("SELECT * FROM likes WHERE email_owner_post=? AND post_id=?", [data['email'], res[n][12]]).fetchall()
        for ii in range(0, len(data_likes)) :
            data_likes_json={
                "liked" :data_likes[ii][0],
                "email" :data_likes[ii][1],
                "emailOwnerPost" :data_likes[ii][2],
                "postId" :res[n][12]
            }
            likes.append(data_likes_json)
        # end of the part of the getting the likes list on the post in that app
        # the start of the try that try to know who have saved the post in that app
        list_saved=[]
        if res[n][13]==1 :
            savedpostswithid=cur.execute("SELECT * FROM savedposts WHERE post_id=?", [res[n][12]]).fetchall()
            for ii in range(0, len(savedpostswithid)) :
                data={
                    "postId" :savedpostswithid[ii][0],
                    "emailSaving" :savedpostswithid[ii][1]
                }
                list_saved.append(data)
        # end of the start in that app
        if res[n][15]=="true" :
            results=cur.execute("SELECT * FROM posts WHERE id=?", [res[n][14]]).fetchone() 
            profilImageSHared=cur.execute("SELECT profil_image, name, username FROM user WHERE email=?", [results[0]]).fetchone()
            data={
                "email" :res[n][0],
                "pio" :res[n][1],
                "image" :res[n][2],
                "year" :res[n][3],
                "month" :res[n][4],
                "day" :res[n][5],
                "hour" :res[n][6],
                "minute" :res[n][7],
                "second" :res[n][8],
                "likes" :res[n][9],
                "likesList" :likes,
                "comments" :res[n][10],
                "commentList" :comments,
                "shares" :res[n][11],
                "profilImage":profilImage[0],
                "name" :profilImage[1],
                "idPostsInPublic" :res[n][12],
                "saved" :res[n][13],
                "sharedState" :res[n][15],
                "savedList" :list_saved,
                # this the part of the post shared in that app 
                "postSharedEmail" :results[0],
                "postSharedPio" :results[1],
                "postSharedImage" :results[2],
                "postSharedYear" :results[3],
                "postSharedMonth" :results[4],
                "postSharedDay" :results[5],
                "postSharedHour" :results[6],
                "postSharedMinute" :results[7],
                "postSharedSecond" :results[8],
                "postSharedId" :results[12],
                "postSharedProfilImage" :profilImageSHared[0],
                "postSharedName" :profilImageSHared[1],
                "postSharedUserName" :profilImageSHared[2],
                # end of this part of the getting the info of the post shared in that app "
                "idPostsInPerson" :n
            }
            list_posts.append(data)
        else :
            data={
                "email" :res[n][0],
                "pio" :res[n][1],
                "image" :res[n][2],
                "year" :res[n][3],
                "month" :res[n][4],
                "day" :res[n][5],
                "hour" :res[n][6],
                "minute" :res[n][7],
                "second" :res[n][8],
                "likes" :res[n][9],
                "likesList" :likes,
                "comments" :res[n][10],
                "commentList" :comments,
                "shares" :res[n][11],
                "profilImage":profilImage[0],
                "name" :profilImage[1],
                "idPostsInPublic" :res[n][12],
                "saved" :res[n][13],
                "savedList" :list_saved,
                "sharedState" :res[n][15],
            }
            list_posts.append(data)
    return JsonResponse(list_posts, safe=False)
# this the part of getting one post in that app
def getPostFunction(data) :
    list_posts=[]
    cur=db.cursor()
    cur.execute("SELECT * FROM posts WHERE id=?", [data['post_id']])
    res=cur.fetchall()
    for n in range(0, len(res)) :
        comments=[]
        comments.clear()
        cur.execute("SELECT profil_image, name FROM user WHERE email=?", [res[n][0]])
        profilImage=cur.fetchone()
        # this the part of getting the comments in this app
        cur.execute("SELECT * FROM comments WHERE email_owner_post=? AND post_id=?", [res[n][0], data['post_id']])
        data_comments=cur.fetchall()
        for i in range(0, len(data_comments)) :
            profil_data=cur.execute("SELECT name, profil_image FROM user WHERE email=?", [data_comments[i][1]]).fetchone()
            data_comments_json={
                "comment" :data_comments[i][0],
                "email" :data_comments[i][1],
                "name" :profil_data[0],
                "profilImage" :profil_data[1],
                "postId" :data_comments[i][2],
                "emailOwnerPost" :data_comments[i][3],
                "year" :data_comments[i][4],
                'month':data_comments[i][5],
                "day":data_comments[i][6],
                "hour":data_comments[i][7],
                "minute" :data_comments[i][8],
                "second" :data_comments[i][9],
                "id" :i
            }
            comments.append(data_comments_json)
        # end of this part is the part of teh getting the comments related to the post in this app
        # this the start of the part of getting the likes for this in this app
        likes=[]
        likes.clear()
        data_likes=cur.execute("SELECT * FROM likes WHERE email_owner_post=? AND post_id=?", [res[n][0], data['post_id']]).fetchall()
        for ii in range(0, len(data_likes)) :
            data_likes_json={
                "liked" :data_likes[ii][0],
                "email" :data_likes[ii][1],
                "emailOwnerPost" :data_likes[ii][2],
                "postId" :res[n][12]
            }
            likes.append(data_likes_json)
        # this the end of this part where getting the likes list in this app
        # this the start of the part where getting the saved list in this app
        list_saved=[]
        if res[n][13]==1 :
            savedpostswithid=cur.execute("SELECT * FROM savedposts WHERE post_id=?", [res[n][12]]).fetchall()
            for ii in range(0, len(savedpostswithid)) :
                data={
                    "postId" :savedpostswithid[ii][0],
                    "emailSaving" :savedpostswithid[ii][1]
                }
                list_saved.append(data)
        if res[n][15]=="true" :
            results=cur.execute("SELECT * FROM posts WHERE id=?", [res[n][14]]).fetchone() 
            profilImageSHared=cur.execute("SELECT profil_image, name, username FROM user WHERE email=?", [results[0]]).fetchone()
            data={
                "email" :res[n][0],
                "pio" :res[n][1],
                "image" :res[n][2],
                "year" :res[n][3],
                "month" :res[n][4],
                "day" :res[n][5],
                "hour" :res[n][6],
                "minute" :res[n][7],
                "second" :res[n][8],
                "likes" :res[n][9],
                "likesList" :likes,
                "comments" :res[n][10],
                "commentList" :comments,
                "shares" :res[n][11],
                "profilImage":profilImage[0],
                "name" :profilImage[1],
                "idPostsInPublic" :res[n][12],
                "saved" :res[n][13],
                "sharedState" :res[n][15],
                "savedList" :list_saved,
                # this the part of the post shared in that app 
                "postSharedEmail" :results[0],
                "postSharedPio" :results[1],
                "postSharedImage" :results[2],
                "postSharedYear" :results[3],
                "postSharedMonth" :results[4],
                "postSharedDay" :results[5],
                "postSharedHour" :results[6],
                "postSharedMinute" :results[7],
                "postSharedSecond" :results[8],
                "postSharedProfilImage" :profilImageSHared[0],
                "postSharedName" :profilImageSHared[1],
                "postSharedUserName" :profilImageSHared[2],
                "postSharedId" :results[12],
                # end of this part of the getting the info of the post shared in that app "
                "idPostsInPerson" :n
            }
            list_posts.append(data)
        else :
            data={
                "email" :res[n][0],
                "pio" :res[n][1],
                "image" :res[n][2],
                "year" :res[n][3],
                "month" :res[n][4],
                "day" :res[n][5],
                "hour" :res[n][6],
                "minute" :res[n][7],
                "second" :res[n][8],
                "likes" :res[n][9],
                "likesList" :likes,
                "comments" :res[n][10],
                "commentList" :comments,
                "shares" :res[n][11],
                "profilImage":profilImage[0],
                "name" :profilImage[1],
                "idPostsInPublic" :res[n][12],
                "saved" :res[n][13],
                "savedList" :list_saved,
                "sharedState" :res[n][15],
            }
            list_posts.append(data)
    return JsonResponse(list_posts, safe=False)
# this the part of getting the saved posts in that app
def getSavedPostsFunction(email) :
    cur=db.cursor()
    savedposts=cur.execute("SELECT * FROM savedposts WHERE email=? ORDER BY post_id DESC", [email]).fetchall()
    list_posts=[]
    for post in savedposts :
        res=cur.execute("SELECT * FROM posts WHERE id=? ORDER BY id", [post[0]]).fetchall()
        for n in range(0, len(res)) :
            cur.execute(f"SELECT profil_image, name FROM user WHERE email=?", [res[n][0]])
            profilImage=cur.fetchone()
            cur.execute(f"SELECT profil_image FROM user WHERE email=?", [email])
            profilImage_login_user=cur.fetchone()
            # this the part related to the getting the comments and as other the next part is the getting likes in that app
            comments=[]
            comments.clear()
            cur.execute("SELECT * FROM comments WHERE email_owner_post=? AND post_id=?", [res[n][0], res[n][12]])
            data_comments=cur.fetchall()
            for i in range(0, len(data_comments)) :
                profil_data=cur.execute("SELECT name, profil_image FROM user WHERE email=?", [data_comments[i][1]]).fetchone()
                data_comments_json={
                    "comment" :data_comments[i][0],
                    "email" :data_comments[i][1],
                    "name" :profil_data[0],
                    "profilImage" :profil_data[1],
                    "postId" :data_comments[i][2],
                    "emailOwnerPost" :data_comments[i][3],
                    "year" :data_comments[i][4],
                    'month':data_comments[i][5],
                    "day":data_comments[i][6],
                    "hour":data_comments[i][7],
                    "minute" :data_comments[i][8],
                    "second" :data_comments[i][9],
                    "id" :i
                }
                comments.append(data_comments_json) 
            # end of the getting the comments in that app
            # this the part of getting the likes in that app
            likes=[]
            likes.clear()
            data_likes=cur.execute("SELECT * FROM likes WHERE email_owner_post=? AND post_id=?", [res[n][0], res[n][12]]).fetchall()
            for ii in range(0, len(data_likes)) :
                data_likes_json={
                    "liked" :data_likes[ii][0],
                    "email" :data_likes[ii][1],
                    "emailOwnerPost" :data_likes[ii][2],
                    "postId" :res[n][12]
                }
                likes.append(data_likes_json)
            # end of the part of the getting the likes list on the post in that app
            # the start of the try that try to know who have saved the post in that app
            list_saved=[]
            if res[n][13]==1 :
                savedpostswithid=cur.execute("SELECT * FROM savedposts WHERE post_id=?", [res[n][12]]).fetchall()
                for ii in range(0, len(savedpostswithid)) :
                    data={
                        "postId" :savedpostswithid[ii][0],
                        "emailSaving" :savedpostswithid[ii][1]
                    }
                    list_saved.append(data)
            # end of the start in that app
            if res[n][15]=="true" :
                results=cur.execute("SELECT * FROM posts WHERE id=?", [res[n][14]]).fetchone() 
                profilImageSHared=cur.execute("SELECT profil_image, name, username FROM user WHERE email=?", [results[0]]).fetchone()
                data={
                    "email" :res[n][0],
                    "pio" :res[n][1],
                    "image" :res[n][2],
                    "year" :res[n][3],
                    "month" :res[n][4],
                    "day" :res[n][5],
                    "hour" :res[n][6],
                    "minute" :res[n][7],
                    "second" :res[n][8],
                    "likes" :res[n][9],
                    "likesList" :likes,
                    "comments" :res[n][10],
                    "commentList" :comments,
                    "shares" :res[n][11],
                    "profilImage":profilImage[0],
                    "name" :profilImage[1],
                    "idPostsInPublic" :res[n][12],
                    "saved" :res[n][13],
                    "sharedState" :res[n][15],
                    "savedList" :list_saved,
                    # this the part of the post shared in that app 
                    "postSharedEmail" :results[0],
                    "postSharedPio" :results[1],
                    "postSharedImage" :results[2],
                    "postSharedYear" :results[3],
                    "postSharedMonth" :results[4],
                    "postSharedDay" :results[5],
                    "postSharedHour" :results[6],
                    "postSharedMinute" :results[7],
                    "postSharedSecond" :results[8],
                    "postSharedId" :results[12],
                    "postSharedProfilImage" :profilImageSHared[0],
                    "postSharedName" :profilImageSHared[1],
                    "postSharedUserName" :profilImageSHared[2],
                    # end of this part of the getting the info of the post shared in that app "
                    "idPostsInPerson" :n
                }
                list_posts.append(data)
            else :
                data={
                    "email" :res[n][0],
                    "pio" :res[n][1],
                    "image" :res[n][2],
                    "year" :res[n][3],
                    "month" :res[n][4],
                    "day" :res[n][5],
                    "hour" :res[n][6],
                    "minute" :res[n][7],
                    "second" :res[n][8],
                    "likes" :res[n][9],
                    "likesList" :likes,
                    "comments" :res[n][10],
                    "commentList" :comments,
                    "shares" :res[n][11],
                    "profilImage":profilImage[0],
                    "name" :profilImage[1],
                    "idPostsInPublic" :res[n][12],
                    "saved" :res[n][13],
                    "savedList" :list_saved,
                    "sharedState" :res[n][15],
                }
                list_posts.append(data)
    return JsonResponse(list_posts, safe=False)
def getSharedPostsFunction(data) :
    cur=db.cursor()
    res=cur.execute("SELECT * FROM posts WHERE id=?", [data['id']]).fetchall()
    list_posts=[]
    # part of the getting of the profil image of the person that want to sahre the post in that app
    profilImagePL=cur.execute("SELECT profil_image FROM user WHERE email=?", [data['email']]).fetchone()
    # end of this part
    for n in range(0, len(res)) :
        # this the part of getting the profil image of the person who own the post that wanted to be shared
        profilImage=cur.execute("SELECT profil_image FROM user WHERE email=?", [res[n][0]]).fetchone()
        # end of that part in that app 
        # this the part related to the getting the comments and as other the next part is the getting likes in that app
        comments=[]
        comments.clear()
        cur.execute("SELECT * FROM comments WHERE email_owner_post=? AND post_id=?", [data['email'], res[n][12]])
        data_comments=cur.fetchall()
        for i in range(0, len(data_comments)) :
            profil_data=cur.execute("SELECT name, profil_image FROM user WHERE email=?", [data_comments[i][1]]).fetchone() 
            data_comments_json={
                "comment" :data_comments[i][0],
                "email" :data_comments[i][1],
                "name" :profil_data[0],
                "profilImage" :profil_data[1],
                "postId" :data_comments[i][2],
                "emailOwnerPost" :data_comments[i][3],
                "year" :data_comments[i][4],
                'month':data_comments[i][5],
                "day":data_comments[i][6],
                "hour":data_comments[i][7],
                "minute" :data_comments[i][8],
                "second" :data_comments[i][9],
                "id" :i
            }
            comments.append(data_comments_json) 
        # end of the getting the comments in that app
        # this the part of getting the likes in that app
        likes=[]
        likes.clear()
        data_likes=cur.execute("SELECT * FROM likes WHERE email_owner_post=? AND post_id=?", [data['email'], res[n][12]]).fetchall()
        for ii in range(0, len(data_likes)) :
            data_likes_json={
                "liked" :data_likes[ii][0],
                "email" :data_likes[ii][1],
                "emailOwnerPost" :data_likes[ii][2],
                "postId" :res[n][12]
            }
            likes.append(data_likes_json)
        # end of the part of the getting the likes list on the post in that app
        # the start of the try that try to know who have saved the post in that app
        list_saved=[]
        if res[n][13]==1 :
            savedpostswithid=cur.execute("SELECT * FROM savedposts WHERE post_id=?", [res[n][12]]).fetchall()
            for ii in range(0, len(savedpostswithid)) :
                data={
                    "postId" :savedpostswithid[ii][0],
                    "emailSaving" :savedpostswithid[ii][1]
                }
                list_saved.append(data)
        # end of the start in that app
        data={
            "email" :res[n][0],
            "pio" :res[n][1],
            "image" :res[n][2],
            "year" :res[n][3],
            "month" :res[n][4],
            "day" :res[n][5],
            "hour" :res[n][6],
            "minute" :res[n][7],
            "second" :res[n][8],
            "likes" :res[n][9],
            "likesList" :likes,
            "comments" :res[n][10],
            "commentList" :comments,
            "shares" :res[n][11],
            "profilImage":profilImage[0],
            "profilImagePL":profilImagePL[0],
            "idPostsInPublic" :res[n][12],
            "saved" :res[n][13],
            "savedList" :list_saved,
            "idPostsInPerson" :n
        }
        list_posts.append(data)
    return JsonResponse(list_posts, safe=False)
# this the part of getting the following emails in this app
def getFollowingEmailsFunction(data) :
    cur=db.cursor()
    res=cur.execute("SELECT * FROM followers WHERE email_followed=? AND email_following=?", [data['email'], data['email_following']]).fetchone()
    try :
        if len(res)>=1 :
                return JsonResponse({
                    "state" :True,
                    "proccess" :"you are following this email already"
                })
        else :
            return JsonResponse({
                "state" :False,
                "proccess" :"you are not following this email already"
            })
    except  :
        return JsonResponse({
            "state" :False,
            "proccess" :"you are not following this email already"
        })
# this the part of the getting the profil data in that app
def profilDataFunction(data) :
    cur=db.cursor()
    cur.execute("SELECT * FROM user WHERE email=?", [data['email']])
    res=cur.fetchall()
    list_res=[]
    for n in range(0,len(res)):
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
        list_res.append(data)
    return JsonResponse(list_res, safe=False)
# Create your views here.