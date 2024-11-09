from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, schemas, crud, auth, dependencies, database

app = FastAPI()

# Enable CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
database.Base.metadata.create_all(bind=database.engine)

# User Registration and Login
@app.post("/register/", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(dependencies.get_db)):
    db_user = crud.create_user(db=db, user=user)
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=schemas.Token)
def login(form_data: schemas.OAuth2EmailRequestForm = Depends(), db: Session = Depends(dependencies.get_db)):
    user = crud.get_user_by_email(db, email=form_data.email)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# User Routes
@app.get("/users/", response_model=List[schemas.UserResponse])
def get_all_users(db: Session = Depends(dependencies.get_db)):
    return crud.get_all_users(db=db)

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(dependencies.get_db)):
    user = crud.get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@app.delete("/users/{user_id}", response_model=dict)
def delete_user(user_id: int, db: Session = Depends(dependencies.get_db)):
    user = crud.delete_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"message": "User deleted successfully"}

# Post Routes
@app.get("/posts/", response_model=List[schemas.PostResponse])
def get_all_posts(db: Session = Depends(dependencies.get_db)):
    return crud.get_all_posts(db=db)

@app.get("/posts/{post_id}", response_model=schemas.PostResponse)
def get_post(post_id: int, db: Session = Depends(dependencies.get_db)):
    post = crud.get_post(db=db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post

@app.post("/posts/", response_model=dict)
def create_post(post: schemas.PostCreate, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    db_post = crud.create_post(db=db, post=post, user_email=current_user.email)
    return {"message": "Post created successfully", "post_id": db_post.id}

@app.delete("/posts/{post_id}", response_model=dict)
def delete_post(post_id: int, db: Session = Depends(dependencies.get_db)):
    post = crud.delete_post(db=db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return {"message": "Post deleted successfully"}

# Comment Routes
@app.get("/comments/", response_model=List[schemas.CommentResponse])
def get_all_comments(db: Session = Depends(dependencies.get_db)):
    return crud.get_all_comments(db=db)

@app.get("/comments/{comment_id}", response_model=schemas.CommentResponse)
def get_comment(comment_id: int, db: Session = Depends(dependencies.get_db)):
    comment = crud.get_comment(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    return comment

@app.post("/posts/{post_id}/comments/", response_model=dict)
def create_comment(post_id: int, comment: schemas.CommentCreate, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    db_comment = crud.create_comment(db=db, comment=comment, user_email=current_user.email, post_id=post_id)
    return {"message": "Comment added successfully"}

@app.delete("/comments/{comment_id}", response_model=dict)
def delete_comment(comment_id: int, db: Session = Depends(dependencies.get_db)):
    comment = crud.delete_comment(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    return {"message": "Comment deleted successfully"}
