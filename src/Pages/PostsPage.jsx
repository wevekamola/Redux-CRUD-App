import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsStart } from "../Reducers/post.reducer";
import { selectPostList, selectPostLoading} from "../Selectors/post.selector";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Button, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { categorizePosts } from "../utils/postUtils";
import { fetchUsersStart } from "../Reducers/auth.reducer";

export default function PostsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectPostLoading);

  const allPosts = useSelector(selectPostList);
  const users = useSelector((state) => state.auth.users);
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsersStart());
    }
  }, [users, dispatch]);

    useEffect(() => {
    dispatch(fetchPostsStart());
  }, [dispatch]);

  const { otherPosts } = categorizePosts(allPosts, users, currentUser?.id);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "userName", headerName: "User Name", width: 200 },
    { field: "userEmail", headerName: "EmailID", width: 250 },
    { field: "body", headerName: "Post", width: 500 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/posts/${params.row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];
  
  return (
    <Container>

      <Typography variant="h4" gutterBottom>
        All Posts
      </Typography>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={otherPosts}
          columns={columns}
          pageSize={10}
          loading={loading}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </div>
    </Container>
  );
}
