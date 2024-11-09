from sqlalchemy.orm import Session
from datetime import datetime
from . import models, schemas, auth

## USER 

# Create a new user
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Get a user by email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# Get a specific user by ID
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# Get all users
def get_all_users(db: Session):
    return db.query(models.User).all()

# Hard delete a user by ID
def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

## POST

# Create a new post
def create_post(db: Session, post: schemas.PostCreate, user_email: str):
    db_post = models.Post(**post.dict(), user_email=user_email)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# Get a specific post by ID
def get_post(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()

# Get all posts
def get_all_posts(db: Session):
    return db.query(models.Post).all()

# Hard delete a post by ID
def delete_post(db: Session, post_id: int):
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()  # Fetch post by ID
    if db_post:
        db.delete(db_post)  # Permanently delete the post from the database
        db.commit()
    return db_post

## COMMENTS

# Create a new comment
def create_comment(db: Session, comment: schemas.CommentCreate, user_email: str, post_id: int):
    db_comment = models.Comment(content=comment.content, user_email=user_email, post_id=post_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

# Get all comments
def get_all_comments(db: Session):
    return db.query(models.Comment).all()

# Get a specific comment by ID
def get_comment(db: Session, comment_id: int):
    return db.query(models.Comment).filter(models.Comment.id == comment_id).first()

# Get all comments for a specific post
def get_all_comments_for_post(db: Session, post_id: int):
    return db.query(models.Comment).filter(models.Comment.post_id == post_id).all()

# Hard delete a comment by ID
def delete_comment(db: Session, comment_id: int):
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()  # Fetch comment by ID
    if db_comment:
        db.delete(db_comment)  # Permanently delete the comment from the database
        db.commit()
    return db_comment

