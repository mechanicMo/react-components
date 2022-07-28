# NOTES
if you use tailwind in a project that imports these components, you MUST not use a prefix config of "mm-" as your styles will clash. if you're not using a prefix option, you can safely ignore this
* on the off chance that your styles are not overriding there, you can use `important: true` in your tailwind.config 

# TODO

## To publish:
npm login
- username: `mechanicmo`

(yarn build && npm publish --access public)