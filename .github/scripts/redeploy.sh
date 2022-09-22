kubectl rollout restart deployment/allocations-react-dashboard -n $STAGE
kubectl rollout status deployment/allocations-react-dashboard -n $STAGE
