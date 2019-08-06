package graphqlbackend

import (
	"context"

	graphql "github.com/graph-gophers/graphql-go"
	"github.com/sourcegraph/sourcegraph/cmd/frontend/graphqlbackend/graphqlutil"
	"github.com/sourcegraph/sourcegraph/pkg/api"
)

func (r *RepositoryResolver) Thread(ctx context.Context, arg struct{ Number string }) (Thread, error) {
	return ThreadInRepository(ctx, r.ID(), arg.Number)
}

func (r *RepositoryResolver) Threads(ctx context.Context, arg *graphqlutil.ConnectionArgs) (ThreadConnection, error) {
	return ThreadsForRepository(ctx, r.ID(), arg)
}

func (r *RepositoryResolver) Changeset(ctx context.Context, arg struct{ Number string }) (Changeset, error) {
	return ChangesetInRepository(ctx, r.ID(), arg.Number)
}

func (r *RepositoryResolver) Changesets(ctx context.Context, arg *graphqlutil.ConnectionArgs) (ChangesetConnection, error) {
	return ChangesetsForRepository(ctx, r.ID(), arg)
}

func (r *RepositoryResolver) ThreadOrIssueOrChangeset(ctx context.Context, arg struct{ Number string }) (*ThreadOrIssueOrChangeset, error) {
	return ThreadOrIssueOrChangesetInRepository(ctx, r.ID(), arg.Number)
}

func (r *RepositoryResolver) ThreadOrIssueOrChangesets(ctx context.Context, arg *ThreadOrIssueOrChangesetConnectionArgs) (ThreadOrIssueOrChangesetConnection, error) {
	return ThreadOrIssueOrChangesetsForRepository(ctx, r.ID(), arg)
}

// TODO!(sqs) document that this is set by enterprise, handle when it's not set, and rethink the
// architecture here.
var ForceRefreshRepositoryThreads func(context.Context, api.RepoID, api.ExternalRepoSpec) error

func (r *schemaResolver) ForceRefreshRepositoryThreads(ctx context.Context, arg *struct{ Repository graphql.ID }) (*RepositoryResolver, error) {
	repo, err := RepositoryByID(ctx, arg.Repository)
	if err != nil {
		return nil, err
	}

	// TODO!(sqs): security, also this is only provided by enterprise
	if err := ForceRefreshRepositoryThreads(ctx, repo.repo.ID, repo.repo.ExternalRepo); err != nil {
		return nil, err
	}
	return repo, nil
}