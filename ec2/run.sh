INSTANCE1=$(./ec2-api-tools/bin/ec2-run-instances -k dev --region eu-west-1 ami-24506250 | grep INSTANCE | awk '{print $2}')
URL1=$(sh desc.sh $INSTANCE1)
echo "$INSTANCE1 $URL1"

INSTANCE2=$(./ec2-api-tools/bin/ec2-run-instances -k dev --region eu-west-1 ami-24506250 | grep INSTANCE | awk '{print $2}')
URL2=$(sh desc.sh $INSTANCE2)
echo "$INSTANCE2 $URL2"

INSTANCE3=$(./ec2-api-tools/bin/ec2-run-instances -k dev --region eu-west-1 ami-24506250 | grep INSTANCE | awk '{print $2}')
URL3=$(sh desc.sh $INSTANCE3)
echo "$INSTANCE3 $URL3"
