echo '===> Compiling & Packaging prestaapps/presta-iam-ui ...'
npm install
npm run deploy

GIT_BRANCH=$(git name-rev --name-only HEAD | sed "s/~.*//")
GIT_COMMIT=$(git rev-parse HEAD)
APP_VERSION=$(git describe --always)
GIT_DIRTY='false'
BUILD_CREATOR=$(git config user.email)
BUILD_NUMBER="${BUILDKITE_BUILD_NUMBER-0}"
# Whether the repo has uncommitted changes
if [[ $(git status -s) ]]; then
    GIT_DIRTY='true'
fi

echo "APP VERSION = "$APP_VERSION

echo '===> Building prestaapps/prestaadminui docker image...'
#Oauth service
docker build \
  -q \
  -t 665804139994.dkr.ecr.us-west-2.amazonaws.com/prestaapps/prestaadminui:latest \
  -t 665804139994.dkr.ecr.us-west-2.amazonaws.com/prestaapps/prestaadminui:"$APP_VERSION" \
  --build-arg GIT_BRANCH="$GIT_BRANCH" \
  --build-arg GIT_COMMIT="$GIT_COMMIT" \
  --build-arg GIT_DIRTY="$GIT_DIRTY" \
  --build-arg BUILD_CREATOR="$BUILD_CREATOR" \
  --build-arg BUILD_NUMBER="$BUILD_NUMBER" \
  .
echo "Done building prestaapps/prestaadminui:"$APP_VERSION

docker push 665804139994.dkr.ecr.us-west-2.amazonaws.com/prestaapps/prestaadminui:"$APP_VERSION"
docker push 665804139994.dkr.ecr.us-west-2.amazonaws.com/prestaapps/prestaadminui:latest
