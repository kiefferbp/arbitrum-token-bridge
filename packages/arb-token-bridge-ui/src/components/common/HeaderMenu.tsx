import React from 'react'
import { Disclosure, Popover } from '@headlessui/react'

import { Transition } from './Transition'
import { ExternalLink } from './ExternalLink'

type HeaderMenuItem = {
  title: string
  anchorProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>
  items?: HeaderMenuItem[]
}

type HeaderMenuProps = {
  children: React.ReactNode
  items: HeaderMenuItem[]
}

export function HeaderMenuDesktop(props: HeaderMenuProps) {
  return (
    <Popover as="div" className="relative inline-block text-left">
      <div>
        <Popover.Button className="arb-hover hidden rounded-md text-base text-white lg:inline-flex">
          {props.children}
        </Popover.Button>
      </div>

      <Transition>
        <Popover.Panel className="focus:outline-none absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-6 py-4">
            {props.items.map((item, index) => {
              if (typeof item.anchorProps !== 'undefined') {
                return (
                  <a
                    key={index}
                    {...item.anchorProps}
                    target="_blank"
                    rel="noreferrer"
                    className="-mx-6 block cursor-pointer px-6 py-1 hover:bg-blue-arbitrum hover:text-white"
                  >
                    {item.title}
                  </a>
                )
              }

              const subitems = item.items || []

              return (
                <div key={index}>
                  <div className="py-1">
                    <span>{item.title}</span>
                  </div>
                  <div>
                    {subitems.map((subitem, sIndex) => (
                      <a
                        key={`${index}.${sIndex}`}
                        href={subitem.anchorProps?.href}
                        target="_blank"
                        rel="noreferrer"
                        className="-mx-6 block py-1 pl-10 pr-6 font-light hover:bg-blue-arbitrum hover:text-white"
                      >
                        {subitem.title}
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export function HeaderMenuMobile(props: HeaderMenuProps) {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="w-full">
          <Disclosure.Button
            className={`arb-hover w-full py-3 ${open && `bg-white`}`}
          >
            <span
              className={`text-2xl font-medium text-white ${
                open && `text-blue-arbitrum`
              }`}
            >
              {props.children}
            </span>
          </Disclosure.Button>
          <Disclosure.Panel>
            <ul className="space-y-4 pt-4 pb-8">
              {props.items.map((item, index) => (
                <li
                  key={index}
                  className="text-center text-2xl font-light text-white"
                >
                  <ExternalLink
                    href={item.anchorProps?.href}
                    className="hover:underline focus:underline"
                  >
                    {item.title}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
