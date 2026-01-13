<script setup lang="ts">
import { Header, Footer } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, MessageSquare, Phone } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold text-foreground mb-8">Support</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent class="p-6 text-center">
            <Mail class="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 class="font-semibold mb-2">Email</h3>
            <p class="text-sm text-muted-foreground">support@soulshapers.com</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-6 text-center">
            <MessageSquare class="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 class="font-semibold mb-2">Live Chat</h3>
            <p class="text-sm text-muted-foreground">Available 9am-5pm EST</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-6 text-center">
            <Phone class="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 class="font-semibold mb-2">Phone</h3>
            <p class="text-sm text-muted-foreground">1-800-SOUL-SHAPE</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="message">Message</Label>
            <textarea id="message" class="w-full min-h-[120px] p-3 rounded-md border bg-background" placeholder="How can we help?" />
          </div>
          <Button>Send Message</Button>
        </CardContent>
      </Card>
    </main>
    
    <Footer />
  </div>
</template>
