image=$(kubectl get deploy -n staging allocations-react-dashboard -o=jsonpath='{.spec.template.spec.containers[0].image}')
kubectl set image deployment/allocations-react-dashboard allocations-react-dashboard=$image -n production
kubectl rollout restart -n production deployment/allocations-react-dashboard
