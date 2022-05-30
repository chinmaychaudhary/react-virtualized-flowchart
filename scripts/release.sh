#! /bin/bash
current_version=$(node -p "require('./package.json').version")

printf "Next version (current is $current_version)? "
read next_version

if ! [[ $next_version =~ ^[0-9]+\.[0-9]+\.[0-9](-.+)? ]]; then
  echo "Version must be a valid semver string, e.g. 1.0.2 or 2.3.0-beta.1"
  exit 1
fi

if [[ $current_version = $next_version ]]; then
  read -p "Are you sure you want to republish the same version? (y/n) " yn
  case $yn in 
    y ) echo "Republishing same version. Deleting the older version"; 
      echo "Successfully deleted older version";;
    n ) exit;;
    * ) echo invalid response; 
      exit;;
  esac
fi

npm version "$next_version" --allow-same-version
cp package.json lib/
git add .
git commit -m "upgrades react-virtualized-flowchart to ${next_version}"

echo "Publishing react-virtualized-flowchart ${next_version}"

cd lib
npm publish
echo "react-virtualized-flowchart ${next_version} is successfully published."
