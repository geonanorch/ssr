import './register'
import {__, component} from 'riot'
import curry from 'curri'
import jsDOMGlobal from 'jsdom-global'

const { CSS_BY_NAME } = __.cssManager

/**
 * Create the renderer function that can produce different types of output from the DOM rendered
 * @param   {Function} renderer - rendering function
 * @param   {string} tagName - tag name of the root node
 * @param   {RiotComponentShell} componentAPI - component shell object
 * @param   {Object} props - initial props
 * @returns {*} output generated by the renderer function
 */
function createRenderer(renderer, tagName, componentAPI, props = {}) {
  const cleanup = jsDOMGlobal()
  const root = document.createElement(tagName)
  const element = component(componentAPI)(root, props)
  const result = renderer({
    // serialize the component outer html
    html: root.outerHTML,
    // serialize all the generated css
    css: [...CSS_BY_NAME.values()].join('\n')
  })
  const dispose = () => {
    // unmount the component
    element.unmount()
    // cleanup the DOM
    cleanup()
    // remove the old stored css
    CSS_BY_NAME.clear()
  }

  // free the memory removing the stuff created in runtime
  dispose()

  return result
}

export default curry(createRenderer)(({html}) => html)
export const fragments = curry(createRenderer)(frags => frags)