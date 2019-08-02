package graphqlbackend

import (
	"context"
	"errors"

	graphql "github.com/graph-gophers/graphql-go"
)

// CommentReplyByID is called to look up a CommentReply given its GraphQL ID.
func CommentReplyByID(ctx context.Context, id graphql.ID) (CommentReply, error) {
	if Comments == nil {
		return nil, errors.New("comments is not implemented")
	}
	return Comments.CommentReplyByID(ctx, id)
}

// CommentReply is the interface for the GraphQL type CommentReply.
type CommentReply interface {
	ID() graphql.ID
	PartialComment
	updatable
}