import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

import { useAuth } from '@/contexts/auth-context';
import { Comment, Options, Post, User } from '@/models';
import { useNavigate } from 'react-router-dom';

export function TableUser() {
  const [users, setUsers] = useState<User[] | []>([]);
  const [posts, setPosts] = useState<Post[] | []>([]);
  const [comments, setComments] = useState<Comment[] | []>([]);
  const [change, setChange] = useState<boolean>(false);
  const { token, email, logout } = useAuth();
  const navigate = useNavigate();
  console.log('TOKEN', token);

  async function handleLogout() {
    try {
      logout();
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out', error);
    }
  }
  async function handleAdd(body: any, options: Options) {
    let url: string;

    switch (options) {
      case 'users':
        url = 'http://44.221.42.183:8000/register/';
        break;
      case 'posts':
        url = 'http://44.221.42.183:8000/posts/';
        break;
      case 'comments':
        url = `http://44.221.42.183:8000/posts/${body.post_id}/comments/`;
        break;
      default:
        return;
    }
    console.log(body);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Replace 'YOUR_TOKEN' with your actual token if needed
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Failed to add data: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Data added successfully:', result);
      setChange((prev) => !prev);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  async function handleDelete(id: number, options: Options) {
    console.log(
      'trying to delete',
      `http://44.221.42.183:8000/${options}/${id}`
    );
    try {
      const response = await fetch(
        `http://44.221.42.183:8000/${options}/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete data: ${response.statusText}`);
      }
      setChange((prev) => !prev);
      console.log('Data deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Replace 'YOUR_TOKEN' with your actual token if needed
        };

        const userResponse = await fetch('http://44.221.42.183:8000/users');
        const usersData = await userResponse.json();
        setUsers(usersData);

        const postResponse = await fetch('http://44.221.42.183:8000/posts');
        const postsData = await postResponse.json();
        setPosts(postsData);

        const commentResponse = await fetch(
          'http://44.221.42.183:8000/comments'
        );
        const commentsData = await commentResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [change]);

  // USERS
  const userRef = useRef({
    name: '',
    email: '',
  });

  // POSTS
  // const refPostTitle = useRef<HTMLInputElement>(null);
  // const refPostContent = useRef<HTMLInputElement>(null);
  // const refPostUserEmail = useRef<HTMLInputElement>(null);

  const postRef = useRef({
    title: '',
    content: '',
  });

  // COMMENTS
  // const refComment = useRef<HTMLInputElement>(null);
  // const refCommentPostId = useRef<HTMLInputElement>(null);
  // const refCommentUserEmail = useRef<HTMLInputElement>(null);
  const commentRef = useRef({
    content: '',
    post_id: '',
  });

  if (!token) {
    return (
      <p>
        Please login{' '}
        <a href="/signin" className="underline">
          here
        </a>
      </p>
    );
  }

  return (
    <div className="w-11/12 mt-20">
      <Tabs defaultValue="user">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="comment">Comment</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <Table>
            <TableCaption>User table list.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right">
                    {user.created_at}
                  </TableCell>
                  <TableCell className="text-center">
                    {email !== user.email && (
                      <Button
                        className="p-2 size-2"
                        variant="outline"
                        onClick={() => handleDelete(user.id, Options.User)}
                      >
                        -
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  className="border-none text-center text-xs"
                  colSpan={5}
                >
                  To add users please login and register as a new users. To
                  remove current user please go to account management and delete
                  current account.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="post">
          <Table>
            <TableCaption>Post table list.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Creator Email</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.content}</TableCell>
                  <TableCell>{post.user_email}</TableCell>
                  <TableCell className="text-right">
                    {post.created_at}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      className="p-2 size-2"
                      variant="outline"
                      onClick={() => handleDelete(post.id, Options.Post)}
                    >
                      -
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium"></TableCell>
                <TableCell>
                  <input
                    type="text"
                    placeholder="Enter title"
                    className="w-full outline-none"
                    onChange={(e) => (postRef.current.title = e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    placeholder="Enter content"
                    className="w-full outline-none"
                    onChange={(e) => (postRef.current.content = e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  {/* <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full outline-none"
                  // ref={refPostUserEmail}
                /> */}
                </TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-center">
                  <Button
                    className="p-2 size-2"
                    variant="outline"
                    onClick={() => handleAdd(postRef.current, Options.Post)}
                  >
                    +
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="comment">
          <Table>
            <TableCaption>Comment table list.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Creator Email</TableHead>
                <TableHead className="text-right">Created At</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">{comment.id}</TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.post_id}</TableCell>
                  <TableCell>{comment.user_email}</TableCell>
                  <TableCell className="text-right">
                    {comment.created_at}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      className="p-2 size-2"
                      variant="outline"
                      onClick={() => handleDelete(comment.id, Options.Comment)}
                    >
                      -
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium"></TableCell>
                <TableCell>
                  <input
                    type="text"
                    placeholder="Enter comment"
                    className="w-full outline-none"
                    onChange={(e) =>
                      (commentRef.current.content = e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    placeholder="Enter post id"
                    className="w-full outline-none"
                    onChange={(e) =>
                      (commentRef.current.post_id = e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  {/* <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full outline-none"
                  // ref={refCommentUserEmail}
                /> */}
                </TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-center">
                  <Button
                    className="p-2 size-2"
                    variant="outline"
                    onClick={() =>
                      handleAdd(commentRef.current, Options.Comment)
                    }
                  >
                    +
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      <Button className=" mt-28" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
