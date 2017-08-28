/**
 * Check whether the selection touches an edge of the container
 *
 * @param  {Element} container DOM Element
 * @param  {Boolean} reverse   Reverse means check if it touches the start of the container
 * @return {Boolean}           Is Edge or not
 */
export function isEdge( container, reverse = false ) {
	if ( [ 'INPUT', 'TEXTAREA' ].indexOf( container.tagName ) !== -1 ) {
		if ( container.selectionStart !== container.selectionEnd ) {
			return false;
		}

		if ( reverse ) {
			return container.selectionStart === 0;
		}

		return container.value.length === container.selectionStart;
	}

	if ( ! container.isContentEditable ) {
		return true;
	}

	const selection = window.getSelection();
	const range = selection.rangeCount ? selection.getRangeAt( 0 ) : null;
	const position = reverse ? 'start' : 'end';
	const order = reverse ? 'first' : 'last';
	const offset = range[ `${ position }Offset` ];

	let node = range.startContainer;

	if ( ! range || ! range.collapsed ) {
		return false;
	}

	if ( reverse && offset !== 0 ) {
		return false;
	}

	if ( ! reverse && offset !== node.textContent.length ) {
		return false;
	}

	while ( node !== container ) {
		const parentNode = node.parentNode;

		if ( parentNode[ `${ order }Child` ] !== node ) {
			return false;
		}

		node = parentNode;
	}

	return true;
}

/**
 * Places the caret at start or end of a given element
 *
 * @param  {Element} container DOM Element
 * @param  {Boolean} start     Position: Start or end of the element
 */
export function placeCaretAtEdge( container, start = false ) {
	const isInputOrTextarea = [ 'INPUT', 'TEXTAREA' ].indexOf( container.tagName ) !== -1;
	if ( isInputOrTextarea ) {
		container.focus();
		setTimeout( () => {
			if ( start ) {
				container.selectionStart = 0;
				container.selectionEnd = 0;
			} else {
				container.selectionStart = container.value.length;
				container.selectionEnd = container.value.length;
			}
		} );
		return;
	}

	function placeCaretInContentEditable( element, atStart ) {
		const range = document.createRange();
		range.selectNodeContents( element );
		range.collapse( atStart );
		const sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange( range );
		element.focus();
	}

	placeCaretInContentEditable( container, start );
}